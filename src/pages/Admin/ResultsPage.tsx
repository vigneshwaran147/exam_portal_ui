import {
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import { usePortal } from "@/hooks/usePortal";

function ResultsPage() {
  const { results, exams, users } = usePortal();
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered = results.filter((r) => {
    const matchLevel = filterLevel === "ALL" || String(r.level) === filterLevel;
    const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchLevel && matchStatus;
  });

  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;
  const avgScore =
    results.length === 0
      ? 0
      : Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);

  return (
    <>
      <PageHeader title="Results" subtitle="View and manage exam results across all levels and employees" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Total Attempts" value={String(results.length)} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Passed" value={String(passCount)} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Failed" value={String(failCount)} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Avg Score" value={`${avgScore}%`} />
        </Grid>
      </Grid>

      {/* Level breakdown */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[0, 1, 2].map((lvl) => {
          const lvlRes = results.filter((r) => r.level === lvl);
          const lvlPass = lvlRes.filter((r) => r.status === "PASS").length;
          const pct = lvlRes.length === 0 ? 0 : Math.round((lvlPass / lvlRes.length) * 100);
          return (
            <Grid key={lvl} size={{ xs: 12, sm: 4 }}>
              <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Level {lvl}</Typography>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">{lvlPass}/{lvlRes.length} passed</Typography>
                  <Typography variant="body2" fontWeight={600}>{pct}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  color={pct >= 60 ? "success" : "error"}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField select size="small" label="Level" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="ALL">All Levels</MenuItem>
          <MenuItem value="0">Level 0</MenuItem>
          <MenuItem value="1">Level 1</MenuItem>
          <MenuItem value="2">Level 2</MenuItem>
        </TextField>
        <TextField select size="small" label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="PASS">Pass</MenuItem>
          <MenuItem value="FAIL">Fail</MenuItem>
        </TextField>
      </Stack>

      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Exam</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Correct</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((result) => {
              const user = users.find((u) => u.id === result.employeeId);
              const exam = exams.find((e) => e.id === result.examId);
              return (
                <TableRow key={result.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{user?.fullName ?? result.employeeId}</Typography>
                    <Typography variant="caption" color="text.secondary">{user?.department}</Typography>
                  </TableCell>
                  <TableCell>{exam?.title ?? result.examId}</TableCell>
                  <TableCell><Chip size="small" label={`L${result.level}`} variant="outlined" /></TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{result.percentage.toFixed(1)}%</Typography>
                    <Typography variant="caption" color="text.secondary">{result.score}/{result.totalMarks}</Typography>
                  </TableCell>
                  <TableCell>{result.score}/{result.totalMarks}</TableCell>
                  <TableCell>
                    <Chip size="small" label={result.status} color={result.status === "PASS" ? "success" : "error"} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{new Date(result.submittedAt).toLocaleDateString()}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>No results found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">Showing {filtered.length} of {results.length} results</Typography>
        </Box>
      </Card>
    </>
  );
}

export default ResultsPage;
