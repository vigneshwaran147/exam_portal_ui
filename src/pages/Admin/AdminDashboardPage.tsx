import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import { usePortal } from "@/hooks/usePortal";

function AdminDashboardPage() {
  const { users, exams, results, proctorEvents, companies } = usePortal();
  const navigate = useNavigate();

  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;
  const passRate = results.length === 0 ? 0 : Math.round((passCount / results.length) * 100);
  const avgScore =
    results.length === 0
      ? 0
      : Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);

  const highViolations = proctorEvents.filter((e) => e.severity === "high");
  const recentViolations = proctorEvents.slice(-5).reverse();

  const levelStats = [0, 1, 2].map((lvl) => {
    const levelResults = results.filter((r) => r.levelUnlocked === lvl);
    const passed = levelResults.filter((r) => r.status === "PASS").length;
    return { level: lvl, total: levelResults.length, passed };
  });

  // Company-wise summary
  const companySummary = companies.map((company) => {
    const compUsers = users.filter((u) => u.companyId === company.id && u.role === "EMPLOYEE");
    const compResults = results.filter((r) => compUsers.some((u) => u.id === r.userId));
    const passed = compResults.filter((r) => r.status === "PASS").length;
    const passRate = compResults.length === 0 ? 0 : Math.round((passed / compResults.length) * 100);
    return { company, empCount: compUsers.length, attempts: compResults.length, passRate };
  });

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Company-level overview — onboard, monitor, and report across all organisations"
        action={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={() => navigate("/admin/companies")}>
              Manage Companies
            </Button>
            <Button size="small" variant="contained" onClick={() => navigate("/admin/live-monitoring")}>
              Live View
            </Button>
          </Stack>
        }
      />

      {/* KPI row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Companies" value={String(companies.length)} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Total Employees" value={String(users.filter((u) => u.role === "EMPLOYEE").length)} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Pass Rate" value={`${passRate}%`} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="AI Alerts" value={String(proctorEvents.length)} />
        </Grid>
      </Grid>

      {/* Company overview table */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>Company Overview</Typography>
            <Button size="small" variant="outlined" onClick={() => navigate("/admin/companies")}>View All</Button>
          </Stack>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Employees</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Exam Attempts</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Pass Rate</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companySummary.map(({ company, empCount, attempts, passRate: cpr }) => (
              <TableRow key={company.id} hover sx={{ cursor: "pointer" }} onClick={() => navigate(`/admin/users?company=${company.id}`)}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>{company.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{company.industry}</Typography>
                </TableCell>
                <TableCell>{empCount}</TableCell>
                <TableCell>{attempts}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={`${cpr}%`}
                    color={cpr >= company.passPercentage ? "success" : attempts === 0 ? "default" : "error"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={company.status} color={company.status === "ACTIVE" ? "success" : "error"} />
                </TableCell>
              </TableRow>
            ))}
            {companySummary.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No companies onboarded yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Grid container spacing={3}>
        {/* Level progression */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <SchoolIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Level Progression</Typography>
              </Stack>
              <Stack spacing={2}>
                {levelStats.map(({ level, total, passed }) => (
                  <Box key={level}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>Level {level}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {passed}/{total} passed
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={total === 0 ? 0 : (passed / total) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography variant="h5" fontWeight={800} color="success.main">{passCount}</Typography>
                  <Typography variant="caption" color="text.secondary">Total Passed</Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} color="error.main">{failCount}</Typography>
                  <Typography variant="caption" color="text.secondary">Total Failed</Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} color="primary.main">{avgScore}%</Typography>
                  <Typography variant="caption" color="text.secondary">Avg Score</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent violations */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WarningAmberIcon color="warning" />
                  <Typography variant="h6" fontWeight={700}>Recent Violations</Typography>
                </Stack>
                {highViolations.length > 0 && (
                  <Chip label={`${highViolations.length} HIGH`} color="error" size="small" />
                )}
              </Stack>
              {recentViolations.length === 0 ? (
                <Alert severity="success" sx={{ mt: 1 }}>No violations recorded.</Alert>
              ) : (
                <List dense disablePadding>
                  {recentViolations.map((ev) => (
                    <ListItem key={ev.id} disablePadding sx={{ py: 0.75 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar
                          sx={{
                            width: 28, height: 28, fontSize: 12,
                            bgcolor: ev.severity === "high" ? "error.light" : ev.severity === "medium" ? "warning.light" : "grey.200",
                            color: ev.severity === "high" ? "error.dark" : "text.primary",
                          }}
                        >
                          {ev.type.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={ev.message}
                        secondary={new Date(ev.timestamp).toLocaleTimeString()}
                        primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                      <Chip
                        size="small"
                        label={ev.severity}
                        color={ev.severity === "high" ? "error" : ev.severity === "medium" ? "warning" : "default"}
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick actions */}
        <Grid size={{ xs: 12 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {[
                  { label: "Manage Users", icon: <GroupIcon />, path: "/admin/users", color: "primary" as const },
                  { label: "Question Bank", icon: <AssignmentIcon />, path: "/admin/question-bank", color: "secondary" as const },
                  { label: "Exam Config", icon: <SchoolIcon />, path: "/admin/exams", color: "info" as const },
                  { label: "Results", icon: <CheckCircleIcon />, path: "/admin/results", color: "success" as const },
                  { label: "Reports", icon: <TrendingUpIcon />, path: "/admin/reports", color: "warning" as const },
                  { label: "Live Monitor", icon: <WarningAmberIcon />, path: "/admin/live-monitoring", color: "error" as const },
                ].map((action) => (
                  <Grid key={action.label} size={{ xs: 6, sm: 4, md: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color={action.color}
                      onClick={() => navigate(action.path)}
                      sx={{ py: 2, flexDirection: "column", gap: 0.5, borderRadius: 2 }}
                    >
                      {action.icon}
                      <Typography variant="caption" fontWeight={600}>{action.label}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Exam overview table */}
        <Grid size={{ xs: 12 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Exam Overview</Typography>
            </CardContent>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Exam</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Questions</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Pass %</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Assigned</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id} hover>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell><Chip size="small" label={`L${exam.level}`} color="primary" variant="outlined" /></TableCell>
                    <TableCell>{exam.questions.length}</TableCell>
                    <TableCell>{exam.durationMinutes} min</TableCell>
                    <TableCell>{exam.passPercentage}%</TableCell>
                    <TableCell>{exam.assignedTo.length}</TableCell>
                  </TableRow>
                ))}
                {exams.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No exams configured.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default AdminDashboardPage;
