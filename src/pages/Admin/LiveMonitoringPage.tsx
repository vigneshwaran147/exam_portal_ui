import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function LiveMonitoringPage() {
  const { proctorEvents, users, proctorSession, recordingChunks } = usePortal();

  const highCount = proctorEvents.filter((e) => e.severity === "high").length;
  const mediumCount = proctorEvents.filter((e) => e.severity === "medium").length;
  const lowCount = proctorEvents.filter((e) => e.severity === "low").length;

  const sevColor = (s: string) =>
    s === "high" ? ("error" as const) : s === "medium" ? ("warning" as const) : ("default" as const);

  return (
    <>
      <PageHeader
        title="Live Monitoring"
        subtitle="Real-time proctoring violations, recording status, and session integrity"
      />

      {/* Session status banner */}
      {proctorSession ? (
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "primary.200", bgcolor: "primary.50", mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <CircleIcon sx={{ fontSize: 12, color: proctorSession.status === "ACTIVE" ? "success.main" : "text.secondary" }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Active Proctor Session — {proctorSession.status}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={`Session: ${proctorSession.sessionId}`} variant="outlined" />
              <Chip size="small" label={`Pending: ${proctorSession.pendingChunks}`} variant="outlined" />
              <Chip size="small" label={`Uploaded: ${proctorSession.uploadedChunks}`} color="success" variant="outlined" />
              <Chip size="small" label={`Failed: ${proctorSession.failedChunks}`} color={proctorSession.failedChunks > 0 ? "error" : "default"} variant="outlined" />
              <Chip size="small" label={`Violation Score: ${proctorSession.violationScore}`} color={proctorSession.violationScore > 5 ? "error" : "warning"} />
              <Chip size="small" label={`Warnings: ${proctorSession.warningCount}`} color="warning" variant="outlined" />
              {proctorSession.policyTerminated && <Chip size="small" label="POLICY TERMINATED" color="error" />}
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>No active proctor session in progress.</Alert>
      )}

      {/* Violation summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "High Severity", count: highCount, color: "error.main", bg: "#FEF2F2" },
          { label: "Medium Severity", count: mediumCount, color: "warning.main", bg: "#FFFBEB" },
          { label: "Low Severity", count: lowCount, color: "text.secondary", bg: "grey.50" },
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="h4" fontWeight={800} sx={{ color: item.color }}>{item.count}</Typography>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Violation event log */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ px: 2, pt: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <WarningAmberIcon color="warning" />
                <Typography variant="h6" fontWeight={700}>Violation Log</Typography>
              </Stack>
            </Box>
            <Divider sx={{ mt: 2 }} />
            {proctorEvents.length === 0 ? (
              <Box sx={{ px: 2, py: 3 }}>
                <Alert severity="success">No violations recorded. All sessions are healthy.</Alert>
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Event</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...proctorEvents].reverse().slice(0, 30).map((ev) => {
                    const user = users.find((u) => u.id === ev.userId);
                    return (
                      <TableRow key={ev.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{ev.message}</Typography>
                          <Typography variant="caption" color="text.secondary">{ev.type}</Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: "primary.main" }}>
                              {(user?.fullName ?? ev.userId).charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{user?.fullName ?? ev.userId}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={ev.severity.toUpperCase()} color={sevColor(ev.severity)} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{new Date(ev.timestamp).toLocaleTimeString()}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </Grid>

        {/* Recording chunks */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <VideocamIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Recording Chunks</Typography>
              </Stack>
            </Box>
            <Divider />
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Media</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recordingChunks.slice(0, 15).map((chunk) => (
                  <TableRow key={chunk.id} hover>
                    <TableCell>{chunk.sequence}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {chunk.mediaType === "video" ? <VideocamIcon sx={{ fontSize: 14 }} /> : <MicIcon sx={{ fontSize: 14 }} />}
                        <Typography variant="body2">{chunk.mediaType}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{chunk.durationSeconds}s</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={chunk.uploadStatus}
                        color={
                          chunk.uploadStatus === "uploaded" ? "success" :
                          chunk.uploadStatus === "failed" ? "error" :
                          chunk.uploadStatus === "uploading" ? "info" : "default"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {recordingChunks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No recording chunks.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {recordingChunks.length > 15 && (
              <>
                <Divider />
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Showing 15 of {recordingChunks.length} chunks
                  </Typography>
                </Box>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default LiveMonitoringPage;
