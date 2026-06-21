import { Paper, Stack, Typography } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import { usePortal } from "@/hooks/usePortal";

function ResultPage() {
  const { currentUser, results } = usePortal();
  const latest = results.find((result) => result.userId === currentUser?.id);

  return (
    <>
      <PageHeader title="Exam Result" subtitle="Latest published result and level progression" />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <StatCard
          label="Score"
          value={latest ? `${latest.score} / ${latest.totalMarks}` : "No Attempt"}
        />
        <StatCard label="Status" value={latest?.status ?? "Pending"} />
        <StatCard label="Current Level" value={`Level ${currentUser?.currentLevel ?? 0}`} />
      </Stack>
      <Paper elevation={0} sx={{ mt: 3, p: 3, border: "1px solid", borderColor: "divider" }}>
        {latest ? (
          <>
            <Typography color="text.secondary">Exam ID: {latest.examId}</Typography>
            <Typography color="text.secondary">Percentage: {latest.percentage}%</Typography>
            {latest.terminatedByPolicy ? (
              <Typography color="error.main">
                Proctoring Policy Failure: {latest.failureReason ?? "Session terminated due to policy violation."}
              </Typography>
            ) : null}
            <Typography color="text.secondary">
              {latest.reviewed
                ? "Contains descriptive questions pending manual review confirmation."
                : "Scored automatically from objective questions."}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">Results will appear after exam submission.</Typography>
        )}
      </Paper>
    </>
  );
}

export default ResultPage;
