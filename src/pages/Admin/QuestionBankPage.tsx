import { Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function QuestionBankPage() {
  const { exams } = usePortal();

  const questions = exams.flatMap((exam) => exam.questions.map((question) => ({ ...question, examTitle: exam.title })));

  return (
    <>
      <PageHeader title="Question Bank" subtitle="Manage categorized questions across levels and formats" />
      <Grid container spacing={2}>
        {questions.map((question) => (
          <Grid key={question.id} size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">{question.examTitle}</Typography>
                <Chip size="small" label={question.type} color="primary" variant="outlined" />
              </Stack>
              <Typography sx={{ mt: 1 }}>{question.questionText}</Typography>
              <Typography variant="caption" color="text.secondary">
                Marks: {question.marks}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default QuestionBankPage;
