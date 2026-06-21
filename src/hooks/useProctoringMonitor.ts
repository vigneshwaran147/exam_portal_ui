import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePortal } from "@/hooks/usePortal";
import { generateChunkChecksum, uploadRecordingChunk } from "@/services/proctoringService";
import type { ProctorSession, RecordingChunk } from "@/types/portal";

type UseProctoringMonitorParams = {
  examId: string;
  onPolicyTerminate?: (reason: string) => Promise<void> | void;
};

type QueueItem = {
  chunkId: string;
  chunkBlob: Blob;
  chunkMeta: RecordingChunk;
  retryCount: number;
};

const CHUNK_MS = 30000;
const requireScreenShare = import.meta.env.VITE_REQUIRE_SCREEN_SHARE !== "false";
const requireEntireScreen = import.meta.env.VITE_REQUIRE_ENTIRE_SCREEN !== "false";

function getRecorderMimeType(kind: "video" | "audio"): string | undefined {
  const candidates =
    kind === "video"
      ? ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"]
      : ["audio/webm;codecs=opus", "audio/webm"];

  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate));
}

export function useProctoringMonitor({ examId, onPolicyTerminate }: UseProctoringMonitorParams) {
  const {
    currentUser,
    proctorSession,
    proctorStatus,
    updateProctorStatus,
    addProctorEvent,
    startProctorSession,
    updateProctorSession,
    endProctorSession,
    addRecordingChunk,
    updateRecordingChunkStatus
  } = usePortal();

  const [error, setError] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [recordingDurationSec, setRecordingDurationSec] = useState(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const monitorVideoRef = useRef<HTMLVideoElement | null>(null);
  const monitorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const recordingHealthRef = useRef<number | null>(null);
  const noiseMonitorRef = useRef<number | null>(null);
  const headMonitorRef = useRef<number | null>(null);
  const durationRef = useRef<number | null>(null);
  const faceMissingSinceRef = useRef<number | null>(null);
  const lastNoiseViolationAtRef = useRef(0);
  const lastHeadViolationAtRef = useRef(0);
  const lastFaceViolationAtRef = useRef(0);
  const warningCountRef = useRef(0);
  const policyTerminatedRef = useRef(false);
  const uploadQueueRef = useRef<QueueItem[]>([]);
  const uploadProcessingRef = useRef(false);
  const retryTimerRef = useRef<number | null>(null);
  const sequenceRef = useRef(0);
  const sessionRef = useRef<ProctorSession | null>(null);

  useEffect(() => {
    sessionRef.current = proctorSession;
  }, [proctorSession]);

  const ensureSession = useCallback(() => {
    if (sessionRef.current?.sessionId) {
      return sessionRef.current.sessionId;
    }
    const created = startProctorSession(examId);
    return created;
  }, [examId, startProctorSession]);

  const registerWarning = useCallback(
    async (reason: string) => {
      if (policyTerminatedRef.current) {
        return;
      }
      warningCountRef.current += 1;
      updateProctorSession({ warningCount: warningCountRef.current });

      if (warningCountRef.current >= 2) {
        policyTerminatedRef.current = true;
        setRuntimeError("2 warnings reached. Exam terminated and marked as fail.");
        updateProctorSession({ status: "ERROR", policyTerminated: true, warningCount: warningCountRef.current });
        if (onPolicyTerminate) {
          await onPolicyTerminate(reason);
        }
      } else {
        setRuntimeError(`Warning ${warningCountRef.current}/2: ${reason}`);
      }
    },
    [onPolicyTerminate, updateProctorSession]
  );

  const raisePolicyError = useCallback(
    (
      message: string,
      type: "BACKGROUND_NOISE" | "HEAD_MOVEMENT" | "FACE_MISSING" | "RECORDING_FAILED" | "CAMERA_BLOCKED" | "MIC_BLOCKED"
    ) => {
      if (policyTerminatedRef.current) {
        return;
      }
      addProctorEvent({
        examId,
        type,
        severity: type === "BACKGROUND_NOISE" || type === "HEAD_MOVEMENT" || type === "FACE_MISSING" ? "medium" : "high",
        message
      });
      if (type === "BACKGROUND_NOISE" || type === "HEAD_MOVEMENT" || type === "FACE_MISSING") {
        void registerWarning(message);
      } else {
        setRuntimeError(message);
        updateProctorSession({ status: "ERROR" });
      }
    },
    [addProctorEvent, examId, registerWarning, updateProctorSession]
  );

  const clearMonitorIntervals = useCallback(() => {
    const refs = [heartbeatRef, recordingHealthRef, noiseMonitorRef, headMonitorRef, durationRef];
    refs.forEach((ref) => {
      if (ref.current) {
        window.clearInterval(ref.current);
        ref.current = null;
      }
    });
  }, []);

  const processQueue = useCallback(async () => {
    if (uploadProcessingRef.current) {
      return;
    }

    uploadProcessingRef.current = true;
    updateProctorSession({ uploadInProgress: true });

    while (uploadQueueRef.current.length > 0) {
      const item = uploadQueueRef.current[0];

      updateRecordingChunkStatus(item.chunkId, "uploading", item.retryCount);

      try {
        await uploadRecordingChunk(item.chunkMeta, item.chunkBlob);
        updateRecordingChunkStatus(item.chunkId, "uploaded", item.retryCount);
        addProctorEvent({
          examId,
          type: "UPLOAD_SUCCESS",
          severity: "low",
          message: `Recording chunk ${item.chunkMeta.sequence} uploaded (${item.chunkMeta.mediaType}).`
        });
        uploadQueueRef.current.shift();
      } catch {
        const nextRetry = item.retryCount + 1;
        updateRecordingChunkStatus(item.chunkId, "failed", nextRetry);
        addProctorEvent({
          examId,
          type: "UPLOAD_FAILED",
          severity: nextRetry >= 3 ? "high" : "medium",
          message: `Chunk upload failed. Retry ${nextRetry}.`
        });
        uploadQueueRef.current.shift();
        uploadQueueRef.current.push({ ...item, retryCount: nextRetry });
        if (!navigator.onLine) {
          updateProctorStatus({ network: "offline" });
          break;
        }
        if (retryTimerRef.current) {
          window.clearTimeout(retryTimerRef.current);
        }
        retryTimerRef.current = window.setTimeout(() => {
          void processQueue();
        }, Math.min(10000, 1000 * nextRetry));
        break;
      }
    }

    uploadProcessingRef.current = false;
    updateProctorSession({ uploadInProgress: false });
  }, [addProctorEvent, examId, updateProctorSession, updateProctorStatus, updateRecordingChunkStatus]);

  const startNoiseMonitor = useCallback(
    (stream: MediaStream) => {
      const audioTrackStream = new MediaStream(stream.getAudioTracks());
      const context = new AudioContext();
      const source = context.createMediaStreamSource(audioTrackStream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);

      audioContextRef.current = context;
      analyserRef.current = analyser;

      noiseMonitorRef.current = window.setInterval(() => {
        if (!analyserRef.current) {
          return;
        }
        const audioData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(audioData);

        let sumSquares = 0;
        for (let i = 0; i < audioData.length; i += 1) {
          const centered = (audioData[i] - 128) / 128;
          sumSquares += centered * centered;
        }
        const rms = Math.sqrt(sumSquares / audioData.length);

        if (rms > 0.05) { // Lowered threshold slightly for better sensitivity
          updateProctorStatus({ audioEnvironment: "noisy" });
          const now = Date.now();
          // Lowered cooldown from 12s to 4s to catch distinct words sooner
          if (now - lastNoiseViolationAtRef.current > 4000) {
            lastNoiseViolationAtRef.current = now;
            raisePolicyError("Background noise detected. Keep your environment silent.", "BACKGROUND_NOISE");
          }
        } else {
          updateProctorStatus({ audioEnvironment: "quiet" });
        }
      }, 500); // Polling faster (twice a second instead of once)
    },
    [raisePolicyError, updateProctorStatus]
  );

  const startHeadMotionMonitor = useCallback(
    (stream: MediaStream) => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.srcObject = stream;
      monitorVideoRef.current = video;

      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 120;
      monitorCanvasRef.current = canvas;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        return;
      }

      void video.play().catch(() => undefined);

      headMonitorRef.current = window.setInterval(() => {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let luminanceSum = 0;
        for (let i = 0; i < frame.length; i += 4) {
          luminanceSum += frame[i] + frame[i + 1] + frame[i + 2];
        }
        const luminanceAvg = luminanceSum / (frame.length / 4) / 3;

        if (luminanceAvg < 12) {
          updateProctorStatus({ face: "missing" });
          if (!faceMissingSinceRef.current) {
            faceMissingSinceRef.current = Date.now();
          }
          const now = Date.now();
          if (
            faceMissingSinceRef.current &&
            now - faceMissingSinceRef.current > 2000 &&
            now - lastFaceViolationAtRef.current > 5000
          ) {
            lastFaceViolationAtRef.current = now;
            raisePolicyError("Face missing from camera frame. Please stay visible.", "FACE_MISSING");
          }
          return;
        }

        faceMissingSinceRef.current = null;
        updateProctorStatus({ face: "detected" });

        const previousFrame = previousFrameRef.current;
        if (previousFrame) {
          let diffSum = 0;
          for (let i = 0; i < frame.length; i += 4) {
            const currentGray = (frame[i] + frame[i + 1] + frame[i + 2]) / 3;
            const previousGray = (previousFrame[i] + previousFrame[i + 1] + previousFrame[i + 2]) / 3;
            diffSum += Math.abs(currentGray - previousGray);
          }
          const motionScore = diffSum / (frame.length / 4) / 255;

          if (motionScore > 0.15) {
            updateProctorStatus({ head: "moving" });
            const now = Date.now();
            if (now - lastHeadViolationAtRef.current > 12000) {
              lastHeadViolationAtRef.current = now;
              raisePolicyError("Head movement detected. Please keep your head steady.", "HEAD_MOVEMENT");
            }
          } else {
            updateProctorStatus({ head: "stable" });
          }
        }

        previousFrameRef.current = new Uint8ClampedArray(frame);
      }, 1200);
    },
    [raisePolicyError, updateProctorStatus]
  );

  const handleChunk = useCallback(
    async (blob: Blob, mediaType: "video" | "audio") => {
      const session = sessionRef.current;
      if (!session || blob.size === 0) {
        return;
      }

      const endTime = Date.now();
      const startTime = endTime - CHUNK_MS;
      const checksum = await generateChunkChecksum(blob);
      const sequence = (sequenceRef.current += 1);

      const fileName = `${mediaType}_${String(sequence).padStart(3, "0")}.webm`;

      const chunkInput = {
        sessionId: session.sessionId,
        employeeId: session.employeeId,
        examId,
        mediaType,
        sequence,
        startTime,
        endTime,
        durationSeconds: Math.round((endTime - startTime) / 1000),
        fileName,
        fileSize: blob.size,
        checksum
      };

      const chunkId = addRecordingChunk(chunkInput);
      const chunkMeta: RecordingChunk = {
        ...chunkInput,
        id: chunkId,
        uploadStatus: "pending",
        retryCount: 0
      };

      uploadQueueRef.current.push({ chunkId, chunkBlob: blob, chunkMeta, retryCount: 0 });
      void processQueue();
    },
    [addRecordingChunk, examId, processQueue]
  );

  const attachTrackGuards = useCallback(
    (stream: MediaStream) => {
      const [videoTrack] = stream.getVideoTracks();
      const [audioTrack] = stream.getAudioTracks();

      if (videoTrack) {
        videoTrack.onended = () => {
          updateProctorStatus({ camera: "blocked" });
          raisePolicyError("Camera disconnected during exam.", "CAMERA_BLOCKED");
        };
      }

      if (audioTrack) {
        audioTrack.onended = () => {
          updateProctorStatus({ microphone: "blocked" });
          raisePolicyError("Microphone disconnected during exam.", "MIC_BLOCKED");
        };
      }
    },
    [raisePolicyError, updateProctorStatus]
  );

  const initializeProctoring = useCallback(async () => {
    setError(null);
    setRuntimeError(null);
    setRecordingDurationSec(0);
    warningCountRef.current = 0;
    policyTerminatedRef.current = false;

    const sessionId = ensureSession();
    if (!sessionId || !currentUser) {
      setError("Unable to create monitoring session.");
      return false;
    }

    updateProctorSession({ status: "INITIALIZING", startedAt: Date.now(), employeeId: currentUser.id, examId });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 20, max: 30 } },
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      mediaStreamRef.current = stream;
      setPreviewStream(stream);
      attachTrackGuards(stream);
      updateProctorStatus({ camera: "connected", microphone: "connected" });

      try {
        if (requireScreenShare) {
          const display = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: "monitor"
            } as MediaTrackConstraints
          });
          const [videoTrack] = display.getVideoTracks();
          const displaySurface = videoTrack?.getSettings().displaySurface;

          if (requireEntireScreen && displaySurface && displaySurface !== "monitor") {
            display.getTracks().forEach((track) => track.stop());
            throw new Error("Entire display is required");
          }

          screenStreamRef.current = display;
          updateProctorStatus({ screenShare: "active" });
          display.getVideoTracks().forEach((track) => {
            track.onended = () => {
              updateProctorStatus({ screenShare: "blocked" });
              addProctorEvent({
                examId,
                type: "SCREENSHARE_STOPPED",
                severity: "high",
                message: "Screen sharing stopped during exam."
              });
            };
          });
        } else {
          updateProctorStatus({ screenShare: "active" });
        }
      } catch {
        if (requireScreenShare) {
          updateProctorStatus({ screenShare: "blocked" });
          setError(
            requireEntireScreen
              ? "Entire-screen sharing is mandatory. Select your full display and allow permission."
              : "Screen sharing permission is mandatory."
          );
          updateProctorSession({ status: "ERROR" });
          return false;
        }
      }

      try {
        await document.documentElement.requestFullscreen();
        updateProctorStatus({ fullscreen: "active" });
      } catch {
        setError("Fullscreen is mandatory to proceed.");
        updateProctorStatus({ fullscreen: "inactive" });
        updateProctorSession({ status: "ERROR" });
        return false;
      }

      const videoStream = new MediaStream(stream.getVideoTracks());
      const audioStream = new MediaStream(stream.getAudioTracks());

      const videoRecorder = new MediaRecorder(videoStream, {
        mimeType: getRecorderMimeType("video")
      });
      const audioRecorder = new MediaRecorder(audioStream, {
        mimeType: getRecorderMimeType("audio")
      });

      videoRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          void handleChunk(event.data, "video");
        }
      };
      audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          void handleChunk(event.data, "audio");
        }
      };

      videoRecorder.onerror = () => {
        updateProctorStatus({ recording: "error" });
        addProctorEvent({
          examId,
          type: "RECORDING_FAILED",
          severity: "high",
          message: "Video recorder failed unexpectedly."
        });
      };
      audioRecorder.onerror = () => {
        updateProctorStatus({ recording: "error" });
        raisePolicyError("Audio recording interrupted unexpectedly.", "RECORDING_FAILED");
      };

      videoRecorder.start(CHUNK_MS);
      audioRecorder.start(CHUNK_MS);

      videoRecorderRef.current = videoRecorder;
      audioRecorderRef.current = audioRecorder;

      updateProctorStatus({ recording: "active", network: navigator.onLine ? "online" : "offline" });
      updateProctorSession({ status: "ACTIVE", startedAt: Date.now(), lastHeartbeat: Date.now(), warningCount: 0 });
      addProctorEvent({
        examId,
        type: "RECORDING_STARTED",
        severity: "low",
        message: "Camera and microphone recording started."
      });

      startNoiseMonitor(stream);
      startHeadMotionMonitor(stream);

      heartbeatRef.current = window.setInterval(() => {
        updateProctorSession({ lastHeartbeat: Date.now() });
        if (!navigator.onLine && proctorStatus.network !== "offline") {
          updateProctorStatus({ network: "offline" });
          addProctorEvent({
            examId,
            type: "NETWORK_OFFLINE",
            severity: "medium",
            message: "Network disconnected. Upload queue will resume once online."
          });
        }
        if (navigator.onLine && proctorStatus.network !== "online") {
          updateProctorStatus({ network: "online" });
          addProctorEvent({
            examId,
            type: "NETWORK_RESTORED",
            severity: "low",
            message: "Network connectivity restored."
          });
          void processQueue();
        }
      }, 10000);

      recordingHealthRef.current = window.setInterval(() => {
        const v = videoRecorderRef.current;
        const a = audioRecorderRef.current;
        if (v?.state !== "recording" || a?.state !== "recording") {
          updateProctorStatus({ recording: "error" });
          raisePolicyError("Mandatory recording interrupted.", "RECORDING_FAILED");
        }
      }, 4000);

      durationRef.current = window.setInterval(() => {
        setRecordingDurationSec((prev) => prev + 1);
      }, 1000);

      setReady(true);
      return true;
    } catch {
      setError("Camera and microphone are mandatory. Please enable permissions.");
      updateProctorStatus({ camera: "blocked", microphone: "blocked", recording: "error" });
      raisePolicyError("Mandatory recording could not be started.", "RECORDING_FAILED");
      updateProctorSession({ status: "ERROR" });
      return false;
    }
  }, [
    attachTrackGuards,
    currentUser,
    ensureSession,
    examId,
    handleChunk,
    processQueue,
    proctorStatus.network,
    raisePolicyError,
    startHeadMotionMonitor,
    startNoiseMonitor,
    updateProctorSession,
    updateProctorStatus
  ]);

  const stopProctoring = useCallback(async () => {
    clearMonitorIntervals();

    videoRecorderRef.current?.stop();
    audioRecorderRef.current?.stop();

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());

    mediaStreamRef.current = null;
    screenStreamRef.current = null;
    setPreviewStream(null);

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    previousFrameRef.current = null;
    monitorVideoRef.current = null;
    monitorCanvasRef.current = null;

    updateProctorStatus({
      camera: "idle",
      microphone: "idle",
      screenShare: "idle",
      fullscreen: "inactive",
      recording: "idle",
      face: "unknown",
      head: "stable",
      audioEnvironment: "quiet"
    });

    updateProctorSession({ status: "STOPPED", endedAt: Date.now(), lastHeartbeat: Date.now() });
    addProctorEvent({
      examId,
      type: "RECORDING_STOPPED",
      severity: "low",
      message: "Recording stopped. Uploading remaining chunks."
    });

    await new Promise((resolve) => window.setTimeout(resolve, 350));
    await processQueue();
    endProctorSession("ENDED");
    setReady(false);
  }, [addProctorEvent, clearMonitorIntervals, endProctorSession, examId, processQueue, updateProctorSession, updateProctorStatus]);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
      }
      clearMonitorIntervals();
    };
  }, [clearMonitorIntervals]);

  const isMandatoryReady = useMemo(() => {
    return (
      ready &&
      proctorStatus.camera === "connected" &&
      proctorStatus.microphone === "connected" &&
      (requireScreenShare ? proctorStatus.screenShare === "active" : true) &&
      proctorStatus.fullscreen === "active" &&
      proctorStatus.recording === "active"
    );
  }, [proctorStatus, ready]);

  return {
    initializeProctoring,
    stopProctoring,
    isMandatoryReady,
    error,
    runtimeError,
    previewStream,
    recordingDurationSec,
    warningCount: warningCountRef.current
  };
}
