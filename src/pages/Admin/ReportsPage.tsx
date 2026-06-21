import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function ReportsPage() {
  const { results, users, exams, proctorEvents } = usePortal();

  // Department performance
  const departments = Array.from(new Set(users.map((u) => u.department)));
  const deptStats = departments.map((dept) => {
    const deptUsers = users.filter((u) => u.department === dept);
    const deptResults = results.filter((r) => deptUsers.some((u) => u.id === r.employeeId));
    const passed = deptResults.filter((r) => r.status === "PASS").length;
    const avgScore =
      deptResults.length === 0
        ? 0
        : Math.round(deptResults.reduce((s, r) => s + r.percentage, 0) / deptResults.length);
    return { dept, total: deptResults.length, passed, avgScore };
  });

  // Level stats
  const levelStats = [0, 1, 2].map((lvl) => {
    const lvlRes = results.filter((r) => r.level === lvl);
    const passed = lvlRes.filter((r) => r.status === "PASS").length;
    const failed = lvlRes.filter((r) => r.status === "FAIL").length;
    const avg =
      lvlRes.length === 0 ? 0 : Math.round(lvlRes.reduce((s, r) => s + r.percentage, 0) / lvlRes.length);
    return { lvl, total: lvlRes.length, passed, failed, avg };
  });

  // Question analysis — most-missed
  const answerStats: Record<string, { correct: number; total: number; text: string }> = {};
  results.forEach((r) => {
    const exam = exams.find((e) => e.id === r.examId);
    if (!exam) return;
    Object.entries(r.answers ?? {}).forEach(([qId, ans]) => {
      const q = exam.questions.find((q) => q.id === qId);
      if (!q) return;
      if (!answerStats[qId]) answerStats[qId] = { correct: 0, total: 0, text: q.questionText };
      answerStats[qId].total += 1;
      const correct = Array.isArray(q.correctAnswer)
        ? JSON.stringify([...(ans as string[])].sort()) === JSON.stringify([...(q.correctAnswer as string[])].sort())
        : ans === q.correctAnswer;
      if (correct) answerStats[qId].correct += 1;
    });
  });

  const hardestQuestions = Object.entries(answerStats)
    .map(([id, s]) => ({ id, ...s, errorRate: s.total === 0 ? 0 : Math.round(((s.total - s.correct) / s.total) * 100) }))
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 5);

  // Violation type breakdown
  const violationTypes = proctorEvents.reduce<Record<string, number>>((acc, ev) => {
    acc[ev.type] = (acc[ev.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Department performance, level analytics, question analysis, and violation trends"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>Export CSV</Button>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>Export PDF</Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        {/* Level report */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Level-wise Performance</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Attempts</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Passed</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Failed</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Avg</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {levelStats.map((row) => (
                    <TableRow key={row.lvl} hover>
                      <TableCell><Chip size="small" label={`Level ${row.lvl}`} /></TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell><Typography color="success.main" fontWeight={600}>{row.passed}</Typography></TableCell>
                      <TableCell><Typography color="error.main" fontWeight={600}>{row.failed}</Typography></TableCell>
                      <TableCell>{row.avg}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Department report */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Department Performance</Typography>
              {deptStats.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No department data available.</Typography>
              ) : (
                <Stack spacing={2}>
                  {deptStats.map((d) => (
                    <Box key={d.dept}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>{d.dept}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {d.passed}/{d.total} · {d.avgScore}% avg
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={d.total === 0 ? 0 : (d.passed / d.total) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                        color={d.avgScore >= 60 ? "success" : "warning"}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Hardest questions */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h6" fontWeight={700}>Most Frequently Missed Questions</Typography>
            </CardContent>
            <Divider />
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 700, width: "60%" }}>Question</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Attempts</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Error Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hardestQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No answer data yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  hardestQuestions.map((q) => (
                    <TableRow key={q.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {q.text.length > 80 ? q.text.slice(0, 80) + "…" : q.text}
                        </Typography>
                      </TableCell>
                      <TableCell>{q.total}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={`${q.errorRate}%`}
                          color={q.errorRate >= 70 ? "error" : q.errorRate >= 40 ? "warning" : "success"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        {/* Violation breakdown */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Violation Type Breakdown</Typography>
              {Object.keys(violationTypes).length === 0 ? (
                <Typography color="text.secondary" variant="body2">No violations recorded.</Typography>
              ) : (
                <Stack spacing={1.5}>
                  {Object.entries(violationTypes)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, count]) => (
                      <Stack key={type} direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{type.replace(/_/g, " ")}</Typography>
                        <Chip size="small" label={count} variant="outlined" />
                      </Stack>
                    ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ReportsPage;
