import { Alert, Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

const requireScreenShare = import.meta.env.VITE_REQUIRE_SCREEN_SHARE !== "false";

function ExamInstructionsPage() {
  const { currentUser, exams, startExam } = usePortal();
  const navigate = useNavigate();
  const availableExams = useMemo(
    () => exams.filter((exam) => exam.assignedTo.includes(currentUser?.id ?? "") && exam.level >= (currentUser?.currentLevel ?? 0)),
    [currentUser?.currentLevel, currentUser?.id, exams]
  );

  const [selectedExam, setSelectedExam] = useState(availableExams[0]?.id ?? "");

  const onStart = () => {
    if (!selectedExam) {
      return;
    }
    startExam(selectedExam);
    navigate("/exam/session");
  };

  return (
    <>
      <PageHeader
        title="Exam Instructions"
        subtitle="Read all instructions before starting the monitored exam"
      />
      <Stack spacing={2}>
        <Alert severity="info">
          {requireScreenShare
            ? "Webcam, microphone, screen share, and full-screen are mandatory."
            : "Webcam, microphone, and full-screen are mandatory. Screen sharing is disabled by policy."}
        </Alert>
        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            <TextField
              select
              label="Assigned Exam"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              sx={{ minWidth: 320 }}
            >
              {availableExams.map((exam) => (
                <MenuItem value={exam.id} key={exam.id}>
                  {exam.title}
                </MenuItem>
              ))}
            </TextField>
            {availableExams.find((exam) => exam.id === selectedExam) ? (
              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  label={`Level ${availableExams.find((exam) => exam.id === selectedExam)?.level}`}
                  color="secondary"
                />
                <Chip
                  size="small"
                  label={`${availableExams.find((exam) => exam.id === selectedExam)?.durationMinutes} mins`}
                  variant="outlined"
                />
              </Stack>
            ) : null}
          </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
          <Typography component="ol" sx={{ pl: 2, mb: 0 }}>
            <li>Do not switch tabs or windows during the exam.</li>
            <li>Keep your face visible and audio enabled throughout.</li>
            <li>Your answers are auto-saved at regular intervals.</li>
            <li>Exam will auto-submit when the timer reaches zero.</li>
          </Typography>
        </Paper>
        <Button variant="contained" onClick={onStart} disabled={!selectedExam}>
          I Understand, Start Exam
        </Button>
      </Stack>
    </>
  );
}

export default ExamInstructionsPage;
