import { Alert, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function LiveMonitoringPage() {
  const { proctorEvents, users, proctorSession, recordingChunks } = usePortal();

  return (
    <>
      <PageHeader title="Live Monitoring" subtitle="Track proctoring violations and active exam integrity signals" />
      <Stack spacing={2}>
        {proctorSession ? (
          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" gutterBottom>
              Recording Session Status
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip size="small" label={`Session: ${proctorSession.sessionId}`} variant="outlined" />
              <Chip size="small" label={`Status: ${proctorSession.status}`} color="primary" variant="outlined" />
              <Chip size="small" label={`Pending: ${proctorSession.pendingChunks}`} variant="outlined" />
              <Chip size="small" label={`Uploaded: ${proctorSession.uploadedChunks}`} color="success" variant="outlined" />
              <Chip size="small" label={`Failed: ${proctorSession.failedChunks}`} color="error" variant="outlined" />
              <Chip size="small" label={`Violation Score: ${proctorSession.violationScore}`} color="warning" />
            </Stack>
          </Paper>
        ) : null}

        {proctorEvents.length === 0 ? (
          <Alert severity="success">No active violations. Live sessions are healthy.</Alert>
        ) : null}
        {proctorEvents.map((event) => {
          const user = users.find((item) => item.id === event.userId);
          return (
            <Paper key={event.id} elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1">{event.message}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.timestamp).toLocaleString()} • {event.examId} • {user?.fullName ?? event.userId}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label={event.type} variant="outlined" />
                  <Chip
                    size="small"
                    label={event.severity.toUpperCase()}
                    color={event.severity === "high" ? "error" : "warning"}
                  />
                </Stack>
              </Stack>
            </Paper>
          );
        })}

        <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" sx={{ px: 1, py: 1 }}>
            Recording Chunks Audit Trail
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Seq</TableCell>
                <TableCell>Media</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Retries</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recordingChunks.slice(0, 20).map((chunk) => (
                <TableRow key={chunk.id}>
                  <TableCell>{chunk.sequence}</TableCell>
                  <TableCell>{chunk.mediaType}</TableCell>
                  <TableCell>{chunk.durationSeconds}s</TableCell>
                  <TableCell>{Math.round(chunk.fileSize / 1024)} KB</TableCell>
                  <TableCell>{chunk.uploadStatus}</TableCell>
                  <TableCell>{chunk.retryCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </>
  );
}

export default LiveMonitoringPage;
