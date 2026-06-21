import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function ExamManagementPage() {
  const { exams } = usePortal();

  return (
    <>
      <PageHeader title="Exam Management" subtitle="Create exams, assign levels, and configure exam rules" />
      <Stack spacing={2}>
        {exams.map((exam) => (
          <Paper key={exam.id} elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                <Typography variant="h6">{exam.title}</Typography>
                <Chip size="small" label={`Level ${exam.level}`} color="secondary" />
                <Chip size="small" label={`${exam.durationMinutes} mins`} variant="outlined" />
                <Chip size="small" label={`${exam.passPercentage}% pass`} variant="outlined" />
              </Stack>
              <Button size="small" variant="outlined">Edit Exam</Button>
            </Stack>
            <Typography sx={{ mt: 1 }} color="text.secondary">
              Questions: {exam.questions.length} • Assigned Employees: {exam.assignedTo.length}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </>
  );
}

export default ExamManagementPage;
