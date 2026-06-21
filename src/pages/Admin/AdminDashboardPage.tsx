import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import { usePortal } from "@/hooks/usePortal";

function AdminDashboardPage() {
  const { users, exams, results, proctorEvents } = usePortal();
  const navigate = useNavigate();

  const passCount = results.filter((item) => item.status === "PASS").length;
  const passRate = results.length === 0 ? 0 : Math.round((passCount / results.length) * 100);

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Operational control center for users, question bank, exams, and live proctoring"
        action={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={() => navigate("/admin/exams")}>Manage Exams</Button>
            <Button size="small" variant="contained" onClick={() => navigate("/admin/live-monitoring")}>Live View</Button>
          </Stack>
        }
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Total Users" value={String(users.length)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Configured Exams" value={String(exams.length)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Pass %" value={`${passRate}%`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Proctor Alerts" value={String(proctorEvents.length)} />
        </Grid>
      </Grid>
      <Paper elevation={0} sx={{ mt: 3, p: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" gutterBottom>
          Phase Coverage
        </Typography>
        <Typography color="text.secondary">Phase 1: RBAC, user management, exam and question bank management.</Typography>
        <Typography color="text.secondary">Phase 2: Timed exam sessions, autosave, scoring, and progression tracking.</Typography>
        <Typography color="text.secondary">Phase 3: Proctoring status events, tab/fullscreen detection, live violation stream.</Typography>
      </Paper>
    </>
  );
}

export default AdminDashboardPage;
