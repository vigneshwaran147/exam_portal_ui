import {
  Box,
  Button,
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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import QuizIcon from "@mui/icons-material/Quiz";
import PercentIcon from "@mui/icons-material/Percent";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function ExamManagementPage() {
  const { exams, results } = usePortal();
  const navigate = useNavigate();

  const levelColors = ["default" as const, "info" as const, "secondary" as const];

  return (
    <>
      <PageHeader
        title="Exam Management"
        subtitle="Create exams, assign levels, configure rules, and track results"
        action={<Button variant="contained" size="small">+ Create Exam</Button>}
      />

      {/* Level summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[0, 1, 2].map((lvl) => {
          const lvlExams = exams.filter((e) => e.level === lvl);
          const lvlResults = results.filter((r) => r?.level === lvl);
          const passed = lvlResults.filter((r) => r.status === "PASS").length;
          return (
            <Grid key={lvl} size={{ xs: 12, sm: 4 }}>
              <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                        Level {lvl}
                      </Typography>
                      <Typography variant="h4" fontWeight={800}>{lvlExams.length}</Typography>
                      <Typography variant="body2" color="text.secondary">exam{lvlExams.length !== 1 ? "s" : ""}</Typography>
                    </Box>
                    <Chip size="small" label={`${passed} passed`} color={levelColors[lvl]} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Exam cards */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {exams.map((exam) => {
          const examResults = results.filter((r) => r.examId === exam.id);
          const passed = examResults.filter((r) => r.status === "PASS").length;
          const passRate = examResults.length === 0 ? null : Math.round((passed / examResults.length) * 100);
          return (
            <Card key={exam.id} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ pb: "16px !important" }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography variant="h6" fontWeight={700}>{exam.title}</Typography>
                      <Chip size="small" label={`Level ${exam.level}`} color={levelColors[exam.level]} />
                    </Stack>
                    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">{exam.durationMinutes} min</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <QuizIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">{exam.questions.length} questions</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PercentIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">Pass: {exam.passPercentage}%</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PeopleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">{exam.assignedTo.length} assigned</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {passRate !== null && (
                      <Chip
                        size="small"
                        label={`${passRate}% pass rate`}
                        color={passRate >= exam.passPercentage ? "success" : "error"}
                        variant="outlined"
                      />
                    )}
                    <Button size="small" variant="outlined" onClick={() => navigate("/admin/results")}>Results</Button>
                    <Button size="small" variant="outlined">Edit</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
        {exams.length === 0 && (
          <Card elevation={0} sx={{ border: "1px dashed", borderColor: "divider" }}>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">No exams configured yet.</Typography>
              <Button variant="contained" sx={{ mt: 2 }}>Create First Exam</Button>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Results table */}
      {results.length > 0 && (
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="h6" fontWeight={700}>Recent Results</Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Exam</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.slice(-10).reverse().map((result) => {
                const exam = exams.find((e) => e.id === result.examId);
                return (
                  <TableRow key={result.id} hover>
                    <TableCell><Typography variant="body2" fontFamily="monospace">{result?.employeeId}</Typography></TableCell>
                    <TableCell>{exam?.title ?? result?.examId}</TableCell>
                    <TableCell><Chip size="small" label={`L${result?.level}`} variant="outlined" /></TableCell>
                    <TableCell>{result?.percentage.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={result?.status}
                        color={result?.status === "PASS" ? "success" : "error"}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Showing last 10 of {results.length} results</Typography>
          </Box>
        </Card>
      )}
    </>
  );
}

export default ExamManagementPage;
