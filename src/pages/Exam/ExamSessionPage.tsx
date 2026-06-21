import { Alert, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ReviewsIcon from "@mui/icons-material/Reviews";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import PageHeader from "@/components/common/PageHeader";
import QuestionCard from "@/components/exam/QuestionCard";
import ProctoringPanel from "@/components/proctoring/ProctoringPanel";
import { useCountdown } from "@/hooks/useCountdown";
import { useProctoringMonitor } from "@/hooks/useProctoringMonitor";
import { usePortal } from "@/hooks/usePortal";

const requireScreenShare = import.meta.env.VITE_REQUIRE_SCREEN_SHARE !== "false";

function ExamSessionPage() {
  const {
    activeSession,
    getActiveExam,
    saveAnswer,
    markReview,
    submitExam,
    proctorStatus,
    proctorSession,
    updateProctorStatus,
    updateProctorSession,
    addProctorEvent,
    proctorEvents,
    activateExamSession,
    forceFailActiveExam
  } = usePortal();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const exam = getActiveExam();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [terminationAlert, setTerminationAlert] = useState<string | null>(null);

  const {
    initializeProctoring,
    stopProctoring,
    isMandatoryReady,
    error: proctoringError,
    runtimeError,
    previewStream,
    recordingDurationSec,
    warningCount
  } = useProctoringMonitor({
    examId: exam?.id ?? "",
    onPolicyTerminate: async (reason: string) => {
      await stopProctoring();
      setSubmitted(true);
      setTerminationAlert(reason);
    }
  });

  const startedAt = activeSession?.startedAt ?? 0;
  const durationSeconds = (exam?.durationMinutes ?? 30) * 60;
  const secondsLeft = useCountdown(startedAt, durationSeconds, Boolean(activeSession?.startedAt));

  useEffect(() => {
    if (!activeSession || !exam || submitted || !activeSession.startedAt) {
      return;
    }

    const autoSaveInterval = window.setInterval(() => {
      const question = exam.questions[questionIndex];
      if (!question) {
        return;
      }
      const currentValue = activeSession.answers[question.id];
      if (currentValue) {
        saveAnswer(question.id, currentValue);
      }
    }, 5000);

    return () => window.clearInterval(autoSaveInterval);
  }, [activeSession, exam, questionIndex, saveAnswer, submitted]);

  useEffect(() => {
    if (!activeSession || !exam || !activeSession.startedAt || secondsLeft > 0 || submitted) {
      return;
    }
    const onAutoSubmit = async () => {
      await stopProctoring();
      const result = submitExam();
      setSubmitted(true);
      if (result) {
        navigate("/result");
      }
    };
    void onAutoSubmit();
  }, [activeSession, exam, navigate, secondsLeft, stopProctoring, submitExam, submitted]);

  useEffect(() => {
    if (!activeSession || !exam) {
      return;
    }

    const handleVisibility = () => {
      if (document.hidden) {
        updateProctorStatus({ tabSwitchCount: proctorStatus.tabSwitchCount + 1 });
        addProctorEvent({
          examId: exam.id,
          type: "TAB_SWITCH",
          severity: "medium",
          message: "Candidate switched tab/window during active exam."
        });
      }
    };

    const handleFullscreen = () => {
      if (document.fullscreenElement) {
        updateProctorStatus({ fullscreen: "active" });
      } else {
        updateProctorStatus({ fullscreen: "inactive" });
        if (isMandatoryReady) {
          addProctorEvent({
            examId: exam.id,
            type: "EXIT_FULLSCREEN",
            severity: "high",
            message: "Candidate exited full-screen mode."
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, [activeSession, addProctorEvent, exam, isMandatoryReady, proctorStatus.tabSwitchCount, updateProctorStatus]);

  useEffect(() => {
    if (searchParams.get("submit") !== "true" || submitted || !activeSession?.startedAt) {
      return;
    }

    const onSubmit = async () => {
      await stopProctoring();
      const result = submitExam();
      setSubmitted(true);
      if (result) {
        navigate("/result");
      }
    };
    void onSubmit();
  }, [activeSession?.startedAt, navigate, searchParams, stopProctoring, submitExam, submitted]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (activeSession && !submitted) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [activeSession, submitted]);

  const startMandatoryProctoring = async () => {
    if (!exam) {
      return;
    }
    const ok = await initializeProctoring();
    if (!ok) {
      return;
    }
    if (!activeSession?.startedAt) {
      activateExamSession();
    }
    updateProctorSession({ status: "ACTIVE", startedAt: Date.now() });
  };

  const startProctoring = async () => {
    await startMandatoryProctoring();
  };

  const onSubmit = async () => {
    await stopProctoring();
    const result = submitExam();
    setSubmitted(true);
    if (result) {
      navigate("/result");
    }
  };

  if (!activeSession || !exam) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography>No active exam found. Start from exam instructions.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/exam/instructions")}>
          Go to Instructions
        </Button>
      </Paper>
    );
  }

  const currentQuestion = exam.questions[questionIndex];
  const total = exam.questions.length;
  const currentSessionEvents = proctorEvents.filter((event) => {
    if (event.examId !== exam.id) {
      return false;
    }
    if (!proctorSession?.startedAt) {
      return false;
    }
    return event.timestamp >= proctorSession.startedAt;
  });

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const answerValue = activeSession.answers[currentQuestion.id];
  const isMarked = activeSession.answers[`__review__${currentQuestion.id}`] === "true";

  return (
    <>
      <PageHeader
        title="Exam Session"
        subtitle={`${exam.title} • Level ${exam.level}`}
        action={
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Chip label={`Q ${questionIndex + 1}/${total}`} color="secondary" />
            <Chip label={`Time Left: ${timerText}`} color={secondsLeft < 300 ? "error" : "primary"} />
          </Stack>
        }
      />

      <Grid container spacing={1.2} sx={{ mt: 0 }}>
        <Grid size={{ xs: 12, md: 9 }} sx={{ order: { xs: 2, md: 1 } }}>
          <Stack spacing={1.2}>
            <Paper elevation={0} sx={{ p: 2.25, border: "1px solid", borderColor: "divider" }}>
              <Stack spacing={1.15}>
                <Alert
                  severity="info"
                  icon={<InfoIcon />}
                  sx={{ py: 1, px: 1.5, "& .MuiAlert-message": { width: "100%" } }}
                >
                  <Typography variant="body2">
                    {requireScreenShare
                      ? "Mandatory recording is enforced. Exam starts only after camera, microphone, screenshare, and fullscreen checks pass."
                      : "Mandatory recording is enforced. Exam starts only after camera, microphone, and fullscreen checks pass."}
                  </Typography>
                </Alert>

                <Alert
                  severity={warningCount > 0 ? "warning" : "success"}
                  icon={warningCount > 0 ? <WarningIcon /> : <CheckCircleIcon />}
                  sx={{ py: 1, px: 1.5, "& .MuiAlert-message": { width: "100%" } }}
                >
                  <Typography variant="body2">
                    Proctoring warnings: <strong>{warningCount}/2</strong>. On second warning, exam auto exits and result is FAIL.
                  </Typography>
                </Alert>

                {!isMandatoryReady || !activeSession.startedAt ? (
                  <>
                    <Divider sx={{ my: 0.5 }} />
                    <Stack spacing={1.2}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75, display: "flex", alignItems: "center", gap: 0.75 }}>
                          <ErrorIcon sx={{ fontSize: 18, color: "warning.main" }} />
                          Proctoring Initialization Required
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          Camera and microphone recording, screen sharing, and full-screen mode must be active before the first question is displayed.
                        </Typography>
                      </Box>
                      {proctoringError ? <Alert severity="error">{proctoringError}</Alert> : null}
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                          onClick={startMandatoryProctoring}
                          sx={{ flex: 1 }}
                        >
                          Start Mandatory Proctoring
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<ArrowBackIcon />}
                          onClick={() => navigate("/exam/instructions")}
                          sx={{ flex: 1 }}
                        >
                          Back to Instructions
                        </Button>
                      </Stack>
                    </Stack>
                  </>
                ) : null}

                {runtimeError ? (
                  <Alert severity="error" icon={<ErrorIcon />} sx={{ py: 1, px: 1.5 }}>
                    <Typography variant="body2">{runtimeError}</Typography>
                  </Alert>
                ) : null}

                {proctorStatus.face === "missing" && activeSession.startedAt ? (
                  <Alert severity="error" icon={<FaceRetouchingNaturalIcon />} sx={{ py: 1, px: 1.5 }}>
                    <Typography variant="body2"><strong>Face Not Visible!</strong> Please ensure your face is clearly visible in the camera frame.</Typography>
                  </Alert>
                ) : null}

                {proctorStatus.audioEnvironment === "noisy" && activeSession.startedAt ? (
                  <Alert severity="warning" icon={<GraphicEqIcon />} sx={{ py: 1, px: 1.5 }}>
                    <Typography variant="body2"><strong>Background Noise Detected!</strong> Please keep your environment silent.</Typography>
                  </Alert>
                ) : null}
              </Stack>
            </Paper>

            {isMandatoryReady && activeSession.startedAt ? (
              <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
                <QuestionCard
                  question={currentQuestion}
                  index={questionIndex}
                  value={answerValue}
                  onChange={(value) => saveAnswer(currentQuestion.id, value)}
                />
                <Divider sx={{ my: 1.75 }} />
                <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={0.8} sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={0.6} sx={{ flex: 1, minWidth: 0 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<NavigateBeforeIcon />}
                      disabled={questionIndex === 0 || Boolean(runtimeError)}
                      onClick={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<NavigateNextIcon />}
                      disabled={questionIndex === total - 1 || Boolean(runtimeError)}
                      onClick={() => setQuestionIndex((prev) => Math.min(total - 1, prev + 1))}
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      Next
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={0.6} sx={{ flex: 1, minWidth: 0 }}>
                    <Button
                      variant={isMarked ? "contained" : "outlined"}
                      color="warning"
                      size="small"
                      startIcon={isMarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      disabled={Boolean(runtimeError)}
                      onClick={() => markReview(currentQuestion.id, !isMarked)}
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      {isMarked ? "📍" : "🔖"}
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<ReviewsIcon />}
                      disabled={Boolean(runtimeError)}
                      onClick={() => navigate("/exam/review")}
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      Review
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Box sx={{ position: "sticky", top: 82, alignSelf: "flex-start", maxHeight: "calc(100vh - 100px)", overflowY: "auto", pr: 0.5 }}>
            <Stack spacing={1.2}>
              <ProctoringPanel
                status={proctorStatus}
                session={proctorSession}
                previewStream={previewStream}
                recordingDurationSec={recordingDurationSec}
                runtimeError={runtimeError}
                events={currentSessionEvents}
              />

              <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.2 }}>
                  Exam Controls
                </Typography>
                <Stack spacing={0.85}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<RestartAltIcon />}
                    onClick={startProctoring}
                  >
                    Re-Validate
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<ReviewsIcon />}
                    disabled={Boolean(runtimeError)}
                    onClick={() => navigate("/exam/review")}
                  >
                    Review Page
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    fullWidth
                    startIcon={<SendIcon />}
                    disabled={!isMandatoryReady}
                    onClick={onSubmit}
                  >
                    Submit Exam
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={Boolean(terminationAlert)} disableEscapeKeyDown>
        <DialogTitle sx={{ color: "error.main", display: "flex", alignItems: "center", gap: 1 }}>
          <ErrorIcon /> Proctoring Policy Failure
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1, mb: 2, fontWeight: 500 }}>
            {terminationAlert}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Due to multiple policy violations, your active session has been terminated and auto-submitted with a failing grade.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => {
              if (terminationAlert) {
                forceFailActiveExam(terminationAlert);
              }
              navigate("/result", { replace: true });
            }} 
            fullWidth
          >
            Continue to Results
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ExamSessionPage;
