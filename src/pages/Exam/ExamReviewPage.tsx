import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function ExamReviewPage() {
  const { activeSession, getActiveExam } = usePortal();
  const navigate = useNavigate();

  const exam = getActiveExam();

  if (!activeSession || !exam) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography>No active exam session found.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/exam/instructions")}>
          Start Exam
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <PageHeader title="Review Answers" subtitle="Check answered and flagged items before final submit" />
      <Stack spacing={2}>
        {exam.questions.map((question, index) => {
          const answered = Boolean(activeSession.answers[question.id]);
          const marked = activeSession.answers[`__review__${question.id}`] === "true";
          return (
            <Paper key={question.id} elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>
                  Q{index + 1}: {question.questionText}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label={answered ? "Answered" : "Not Answered"} color={answered ? "success" : "default"} />
                  {marked ? <Chip size="small" label="Marked for Review" color="warning" /> : null}
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/exam/session")}>Back to Exam</Button>
        <Button variant="contained" onClick={() => navigate("/exam/session?submit=true")}>Submit Exam</Button>
      </Stack>
    </>
  );
}

export default ExamReviewPage;
