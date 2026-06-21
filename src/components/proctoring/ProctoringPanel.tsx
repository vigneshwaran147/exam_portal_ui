import {
  Alert,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import WifiIcon from "@mui/icons-material/Wifi";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ProctorEvent, ProctorSession, ProctoringStatus } from "@/types/portal";

type ProctoringPanelProps = {
  status: ProctoringStatus;
  events: ProctorEvent[];
  session: ProctorSession | null;
  previewStream: MediaStream | null;
  recordingDurationSec: number;
  runtimeError: string | null;
};

type StatusRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
  ok: boolean;
};

function StatusRow({ icon, label, value, ok }: StatusRowProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "20px 1fr auto",
        alignItems: "center",
        gap: 1,
        px: 1,
        py: 0.85,
        borderBottom: "1px solid",
        borderColor: "divider"
      }}
    >
      <Box sx={{ display: "grid", placeItems: "center", color: "text.secondary" }}>{icon}</Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Chip
        size="small"
        label={value}
        color={ok ? "success" : "warning"}
        variant={ok ? "filled" : "outlined"}
        sx={{ height: 22, fontSize: 12 }}
      />
    </Box>
  );
}

function toDuration(totalSeconds: number): string {
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function toTime(timestamp: number): string {
  const date = new Date(timestamp);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function ProctoringPanel({
  status,
  events,
  session,
  previewStream,
  recordingDurationSec,
  runtimeError
}: ProctoringPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = previewStream;
  }, [previewStream]);

  const topEvents = useMemo(() => events.slice(0, 5), [events]);

  const { okCount, issueCount } = useMemo(() => {
    let ok = 0;
    let issue = 0;
    status.camera === "connected" ? ok++ : issue++;
    status.microphone === "connected" ? ok++ : issue++;
    status.screenShare === "active" ? ok++ : issue++;
    status.fullscreen === "active" ? ok++ : issue++;
    status.recording === "active" ? ok++ : issue++;
    status.network === "online" ? ok++ : issue++;
    status.face === "detected" ? ok++ : issue++;
    status.head === "stable" ? ok++ : issue++;
    status.audioEnvironment === "quiet" ? ok++ : issue++;
    return { okCount: ok, issueCount: issue };
  }, [status]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        mt: 0
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 0.5, mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontSize: 16, fontWeight: 700 }}>
          Proctoring Monitor
        </Typography>
        <Chip
          size="small"
          icon={<FiberManualRecordIcon sx={{ color: "#e53935 !important", fontSize: 11 }} />}
          label="REC"
          variant="outlined"
          sx={{ fontWeight: 700, letterSpacing: 0.1, height: 20 }}
        />
      </Stack>

      <Box
        sx={{
          position: "relative",
          borderRadius: 1.5,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          mb: 1.2,
          bgcolor: "#081526"
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: "100%", minHeight: 175, objectFit: "cover", display: "block" }}
        />
        <Box
          sx={{
            position: "absolute",
            right: 10,
            bottom: 10,
            px: 1,
            py: 0.2,
            borderRadius: 1,
            bgcolor: "rgba(0, 0, 0, 0.72)"
          }}
        >
          <Typography sx={{ color: "#fff", fontSize: 12, fontFamily: "monospace", fontWeight: 700 }}>
            {toDuration(recordingDurationSec)}
          </Typography>
        </Box>
      </Box>

      <Accordion disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", mb: 1, "&:before": { display: "none" } }} defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 1, minHeight: "36px !important", "& .MuiAccordionSummary-content": { my: "0 !important" } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>Proctoring Status</Typography>
            <Chip size="small" label={`${okCount} OK`} color="success" sx={{ height: 20, fontSize: 11, fontWeight: 700 }} />
            {issueCount > 0 && <Chip size="small" label={`${issueCount} Issues`} color="error" sx={{ height: 20, fontSize: 11, fontWeight: 700 }} />}
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Box sx={{ borderTop: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <StatusRow icon={<VideocamIcon sx={{ fontSize: 16 }} />} label="Camera" value={status.camera} ok={status.camera === "connected"} />
            <StatusRow icon={<MicIcon sx={{ fontSize: 16 }} />} label="Microphone" value={status.microphone} ok={status.microphone === "connected"} />
            <StatusRow icon={<ScreenShareIcon sx={{ fontSize: 16 }} />} label="Screen Share" value={status.screenShare} ok={status.screenShare === "active"} />
            <StatusRow icon={<FullscreenIcon sx={{ fontSize: 16 }} />} label="Fullscreen" value={status.fullscreen} ok={status.fullscreen === "active"} />
            <StatusRow icon={<FiberManualRecordIcon sx={{ fontSize: 12 }} />} label="Recording" value={status.recording} ok={status.recording === "active"} />
            <StatusRow icon={<WifiIcon sx={{ fontSize: 16 }} />} label="Network" value={status.network} ok={status.network === "online"} />
            <StatusRow icon={<FaceRetouchingNaturalIcon sx={{ fontSize: 16 }} />} label="Face" value={status.face} ok={status.face === "detected"} />
            <StatusRow icon={<PsychologyIcon sx={{ fontSize: 16 }} />} label="Head Movement" value={status.head} ok={status.head === "stable"} />
            <StatusRow icon={<GraphicEqIcon sx={{ fontSize: 16 }} />} label="Noise" value={status.audioEnvironment} ok={status.audioEnvironment === "quiet"} />
          </Box>
        </AccordionDetails>
      </Accordion>

      {session ? (
        <Stack spacing={0.35} sx={{ px: 0.4, mb: 1 }}>
          <Typography variant="body2" color="text.secondary"><strong>Session:</strong> {session.sessionId.substring(0, 8)}...</Typography>
          <Typography variant="body2" color="text.secondary"><strong>Tab Switches:</strong> {status.tabSwitchCount}</Typography>
          <Typography variant="body2" color="text.secondary"><strong>Chunks:</strong> ↑{session.uploadedChunks} ⏳{session.pendingChunks} ✗{session.failedChunks}</Typography>
          <Typography variant="body2" color="text.secondary"><strong>Violation Score:</strong> {session.violationScore}</Typography>
          <Typography variant="body2" color="warning.main"><strong>Warnings:</strong> {session.warningCount}/2</Typography>
          <Typography variant="body2" color="success.main"><strong>Status:</strong> {session.status === "ACTIVE" ? "🟢 Monitoring" : `🔴 ${session.status}`}</Typography>
        </Stack>
      ) : null}

      {runtimeError ? <Alert severity="error" sx={{ mb: 1, py: 0.75 }}>{runtimeError}</Alert> : null}

      <Divider sx={{ mb: 0.8 }} />
      <Typography variant="caption" sx={{ mb: 0.4, px: 0.3, display: "block", fontWeight: 700, color: "text.secondary" }}>
        Violation Timeline
      </Typography>
      <Stack spacing={0.6} sx={{ maxHeight: 160, overflowY: "auto", pr: 0.3 }}>
        {topEvents.map((event) => (
          <Box key={event.id} sx={{ pb: 0.6, borderLeft: "2px solid", borderColor: event.severity === "high" ? "error.main" : event.severity === "medium" ? "warning.main" : "info.main", pl: 0.8 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: event.severity === "high" ? "error.main" : event.severity === "medium" ? "warning.main" : "info.main", display: "block", fontSize: 10 }}>
              {toTime(event.timestamp)}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", wordWrap: "break-word", whiteSpace: "normal", fontSize: 10, mt: 0.25 }}>
              {event.message}
            </Typography>
          </Box>
        ))}
        {topEvents.length === 0 ? (
          <Typography variant="caption" sx={{ color: "success.main", fontStyle: "italic" }}>
            ✓ No violations detected.
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}

export default ProctoringPanel;
