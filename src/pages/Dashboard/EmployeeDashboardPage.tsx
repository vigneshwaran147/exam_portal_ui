import { Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import { usePortal } from "@/hooks/usePortal";

function EmployeeDashboardPage() {
  const { currentUser, exams, results, proctorEvents } = usePortal();
  const navigate = useNavigate();

  const myExams = useMemo(
    () => exams.filter((exam) => exam.assignedTo.includes(currentUser?.id ?? "")),
    [currentUser?.id, exams]
  );

  const myResults = results.filter((result) => result.userId === currentUser?.id);
  const latestResult = myResults[0];

  return (
    <>
      <PageHeader
        title="Employee Dashboard"
        subtitle="Track level progression, assigned exams, and exam integrity status"
        action={
          <Button variant="contained" onClick={() => navigate("/exam/instructions")}>
            Start Assigned Exam
          </Button>
        }
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Current Level" value={`Level ${currentUser?.currentLevel ?? 0}`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Assigned Exams" value={String(myExams.length)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Completed Exams" value={String(myResults.length)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Violations" value={String(proctorEvents.filter((event) => event.userId === currentUser?.id).length)} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 0.3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Assigned Assessments
            </Typography>
            <Stack spacing={1.5}>
              {myExams.map((exam) => (
                <Stack
                  key={exam.id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  sx={{ p: 1.5, borderRadius: 2, backgroundColor: "rgba(0, 87, 184, 0.05)" }}
                >
                  <Typography sx={{ fontWeight: 600 }}>{exam.title}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" label={`Level ${exam.level}`} color="secondary" />
                    <Chip size="small" label={`${exam.durationMinutes} mins`} variant="outlined" />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Latest Result Snapshot
            </Typography>
            {latestResult ? (
              <Stack spacing={1}>
                <Typography color="text.secondary">Exam: {latestResult.examId}</Typography>
                <Typography color="text.secondary">Score: {latestResult.score} / {latestResult.totalMarks}</Typography>
                <Chip
                  size="small"
                  label={latestResult.status}
                  color={latestResult.status === "PASS" ? "success" : "error"}
                  sx={{ width: "fit-content" }}
                />
              </Stack>
            ) : (
              <Typography color="text.secondary">No submissions yet. Start your first exam.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default EmployeeDashboardPage;
