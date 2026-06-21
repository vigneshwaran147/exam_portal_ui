import { io } from "socket.io-client";
import type { RecordingChunk } from "@/types/portal";

const socketBaseUrl = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:8080";

export const proctorSocket = io(socketBaseUrl, {
  autoConnect: false,
  transports: ["websocket"]
});

export function createProctorSessionId() {
  return crypto.randomUUID();
}

function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateChunkChecksum(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return bytesToHex(digest);
}

export async function uploadRecordingChunk(chunk: RecordingChunk, blob: Blob): Promise<void> {
  if (!navigator.onLine) {
    throw new Error("Network offline");
  }

  const formData = new FormData();
  formData.append("file", blob, chunk.fileName);
  formData.append(
    "metadata",
    JSON.stringify({
      sessionId: chunk.sessionId,
      employeeId: chunk.employeeId,
      examId: chunk.examId,
      sequence: chunk.sequence,
      mediaType: chunk.mediaType,
      startTime: chunk.startTime,
      endTime: chunk.endTime,
      duration: chunk.durationSeconds,
      checksum: chunk.checksum
    })
  );

  const response = await fetch(`${socketBaseUrl}/upload/${chunk.mediaType}`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
}
