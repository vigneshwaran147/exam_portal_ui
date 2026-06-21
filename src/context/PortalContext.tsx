import { createContext, useMemo, useState } from "react";
import { mockExams, mockUsers } from "@/data/mockPortalData";
import type { UserRole } from "@/types/auth";
import type { Exam, ExamQuestion, ExamResult, UserAnswerValue } from "@/types/exam";
import type {
  ExamSession,
  PortalContextValue,
  PortalState,
  ProctorEvent,
  ProctorSession,
  ProctoringStatus,
  RecordingChunk,
  RecordingUploadStatus
} from "@/types/portal";

const LOCAL_STATE_KEY = "employee_exam_portal_state_v1";

const initialProctorStatus: ProctoringStatus = {
  camera: "idle",
  microphone: "idle",
  screenShare: "idle",
  fullscreen: "inactive",
  recording: "idle",
  network: navigator.onLine ? "online" : "offline",
  face: "unknown",
  head: "stable",
  audioEnvironment: "quiet",
  tabSwitchCount: 0
};

const emptyProctorSession = {
  startedAt: null,
  endedAt: null,
  status: "IDLE",
  uploadInProgress: false,
  pendingChunks: 0,
  uploadedChunks: 0,
  failedChunks: 0,
  lastHeartbeat: null,
  violationScore: 0,
  warningCount: 0,
  policyTerminated: false
} as const;

type StoredState = Pick<PortalState, "currentUser" | "activeSession" | "results" | "proctorEvents" | "proctorSession" | "recordingChunks">;

function getInitialState(): PortalState {
  const defaultState: PortalState = {
    users: mockUsers,
    currentUser: null,
    exams: mockExams,
    activeSession: null,
    results: [],
    proctorStatus: initialProctorStatus,
    proctorEvents: [],
    proctorSession: null,
    recordingChunks: []
  };

  try {
    const raw = localStorage.getItem(LOCAL_STATE_KEY);
    if (!raw) {
      return defaultState;
    }
    const parsed = JSON.parse(raw) as StoredState;
    return {
      ...defaultState,
      currentUser: parsed.currentUser,
      activeSession: parsed.activeSession,
      results: parsed.results,
      proctorEvents: parsed.proctorEvents,
      proctorSession: parsed.proctorSession,
      recordingChunks: parsed.recordingChunks ?? []
    };
  } catch {
    return defaultState;
  }
}

function evaluateObjectiveQuestion(question: ExamQuestion, answer: UserAnswerValue | undefined): number {
  if (!answer) {
    return 0;
  }
  if (question.correctAnswer === "manual-review") {
    return 0;
  }

  if (Array.isArray(question.correctAnswer)) {
    if (!Array.isArray(answer)) {
      return 0;
    }
    const expected = [...question.correctAnswer].sort().join("|");
    const actual = [...answer].sort().join("|");
    return expected === actual ? question.marks : 0;
  }

  if (Array.isArray(answer)) {
    return 0;
  }

  return answer.trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase() ? question.marks : 0;
}

function getLevelUnlock(level: 0 | 1 | 2, passed: boolean): 0 | 1 | 2 {
  if (!passed) {
    return level;
  }
  return Math.min(2, level + 1) as 0 | 1 | 2;
}

export const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PortalState>(getInitialState);

  const persist = (next: PortalState) => {
    const toStore: StoredState = {
      currentUser: next.currentUser,
      activeSession: next.activeSession,
      results: next.results,
      proctorEvents: next.proctorEvents,
      proctorSession: next.proctorSession,
      recordingChunks: next.recordingChunks
    };
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(toStore));
  };

  const updateState = (updater: (prev: PortalState) => PortalState) => {
    setState((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  };

  const login = (employeeId: string, password: string, selectedRole?: UserRole) => {
    if (!employeeId.trim() || !password.trim()) {
      return { success: false, message: "Employee ID and password are required." };
    }

    const matched = state.users.find(
      (user) =>
        user.id.toLowerCase() === employeeId.trim().toLowerCase() &&
        (!selectedRole || user.role === selectedRole)
    );

    if (!matched) {
      return { success: false, message: "Invalid credentials or role mismatch." };
    }

    updateState((prev) => ({
      ...prev,
      currentUser: matched
    }));
    return { success: true };
  };

  const logout = () => {
    updateState((prev) => ({
      ...prev,
      currentUser: null,
      activeSession: null,
      proctorStatus: initialProctorStatus,
      proctorSession: null
    }));
  };

  const startExam = (examId: string) => {
    const nextSession: ExamSession = {
      examId,
      startedAt: null,
      answers: {},
      isSubmitted: false,
      savedAt: Date.now()
    };
    updateState((prev) => ({
      ...prev,
      activeSession: nextSession,
      proctorStatus: initialProctorStatus,
      proctorEvents: [],
      proctorSession: null,
      recordingChunks: []
    }));
  };

  const activateExamSession = () => {
    updateState((prev) => {
      if (!prev.activeSession) {
        return prev;
      }
      return {
        ...prev,
        activeSession: {
          ...prev.activeSession,
          startedAt: Date.now(),
          savedAt: Date.now()
        }
      };
    });
  };

  const saveAnswer = (questionId: string, value: UserAnswerValue) => {
    updateState((prev) => {
      if (!prev.activeSession) {
        return prev;
      }
      return {
        ...prev,
        activeSession: {
          ...prev.activeSession,
          answers: {
            ...prev.activeSession.answers,
            [questionId]: value
          },
          savedAt: Date.now()
        }
      };
    });
  };

  const markReview = (questionId: string, marked: boolean) => {
    updateState((prev) => {
      if (!prev.activeSession) {
        return prev;
      }
      const tag = `__review__${questionId}`;
      const nextAnswers = { ...prev.activeSession.answers };
      if (marked) {
        nextAnswers[tag] = "true";
      } else {
        delete nextAnswers[tag];
      }
      return {
        ...prev,
        activeSession: {
          ...prev.activeSession,
          answers: nextAnswers,
          savedAt: Date.now()
        }
      };
    });
  };

  const updateProctorStatus = (status: Partial<ProctoringStatus>) => {
    updateState((prev) => ({
      ...prev,
      proctorStatus: {
        ...prev.proctorStatus,
        ...status
      }
    }));
  };

  const addProctorEvent = (event: Omit<ProctorEvent, "id" | "timestamp" | "userId">) => {
    updateState((prev) => {
      if (!prev.currentUser) {
        return prev;
      }
      const created = {
        ...event,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        userId: prev.currentUser.id
      };

      const severityScore = event.severity === "high" ? 5 : event.severity === "medium" ? 3 : 1;
      return {
        ...prev,
        proctorEvents: [created, ...prev.proctorEvents],
        proctorSession: prev.proctorSession
          ? {
              ...prev.proctorSession,
              violationScore: prev.proctorSession.violationScore + severityScore
            }
          : prev.proctorSession
      };
    });
  };

  const startProctorSession = (examId: string): string | null => {
    if (!state.currentUser) {
      return null;
    }
    const sessionId = crypto.randomUUID();
    updateState((prev) => ({
      ...prev,
      proctorSession: {
        ...emptyProctorSession,
        sessionId,
        examId,
        employeeId: prev.currentUser?.id ?? "",
        status: "INITIALIZING"
      },
      proctorStatus: {
        ...prev.proctorStatus,
        recording: "idle"
      }
    }));
    return sessionId;
  };

  const updateProctorSession = (status: Partial<ProctorSession>) => {
    updateState((prev) => {
      if (!prev.proctorSession) {
        return prev;
      }
      return {
        ...prev,
        proctorSession: {
          ...prev.proctorSession,
          ...status
        }
      };
    });
  };

  const endProctorSession = (status: ProctorSession["status"] = "ENDED") => {
    updateState((prev) => {
      if (!prev.proctorSession) {
        return prev;
      }
      return {
        ...prev,
        proctorSession: {
          ...prev.proctorSession,
          status,
          endedAt: Date.now(),
          uploadInProgress: false,
          lastHeartbeat: Date.now()
        },
        proctorStatus: {
          ...prev.proctorStatus,
          recording: "idle"
        }
      };
    });
  };

  const addRecordingChunk = (chunk: Omit<RecordingChunk, "id" | "uploadStatus" | "retryCount">) => {
    const id = crypto.randomUUID();
    updateState((prev) => ({
      ...prev,
      recordingChunks: [
        {
          ...chunk,
          id,
          uploadStatus: "pending",
          retryCount: 0
        },
        ...prev.recordingChunks
      ],
      proctorSession: prev.proctorSession
        ? {
            ...prev.proctorSession,
            pendingChunks: prev.proctorSession.pendingChunks + 1
          }
        : prev.proctorSession
    }));
    return id;
  };

  const updateRecordingChunkStatus = (chunkId: string, uploadStatus: RecordingUploadStatus, retryCount?: number) => {
    updateState((prev) => {
      let pendingDelta = 0;
      let uploadedDelta = 0;
      let failedDelta = 0;

      const nextChunks = prev.recordingChunks.map((chunk) => {
        if (chunk.id !== chunkId) {
          return chunk;
        }

        if (chunk.uploadStatus !== "uploaded" && uploadStatus === "uploaded") {
          pendingDelta -= 1;
          uploadedDelta += 1;
          if (chunk.uploadStatus === "failed") {
            failedDelta -= 1;
          }
        } else if (chunk.uploadStatus !== "failed" && uploadStatus === "failed") {
          failedDelta += 1;
        }

        return {
          ...chunk,
          uploadStatus,
          retryCount: retryCount ?? chunk.retryCount
        };
      });

      return {
        ...prev,
        recordingChunks: nextChunks,
        proctorSession: prev.proctorSession
          ? {
              ...prev.proctorSession,
              pendingChunks: Math.max(0, prev.proctorSession.pendingChunks + pendingDelta),
              uploadedChunks: Math.max(0, prev.proctorSession.uploadedChunks + uploadedDelta),
              failedChunks: Math.max(0, prev.proctorSession.failedChunks + failedDelta)
            }
          : prev.proctorSession
      };
    });
  };

  const getExamById = (examId: string): Exam | undefined => state.exams.find((exam) => exam.id === examId);

  const getActiveExam = () => {
    if (!state.activeSession) {
      return undefined;
    }
    return state.exams.find((exam) => exam.id === state.activeSession?.examId);
  };

  const getQuestionById = (exam: Exam, questionId: string) => exam.questions.find((q) => q.id === questionId);

  const submitExam = (): ExamResult | null => {
    if (!state.currentUser || !state.activeSession || !state.activeSession.startedAt) {
      return null;
    }

    const exam = getActiveExam();
    if (!exam) {
      return null;
    }

    const score = exam.questions.reduce((acc, question) => {
      const answer = state.activeSession?.answers[question.id];
      return acc + evaluateObjectiveQuestion(question, answer);
    }, 0);

    const percentage = Number(((score / exam.totalMarks) * 100).toFixed(2));
    const passed = percentage >= exam.passPercentage;

    const result: ExamResult = {
      id: crypto.randomUUID(),
      examId: exam.id,
      userId: state.currentUser.id,
      score,
      totalMarks: exam.totalMarks,
      percentage,
      status: passed ? "PASS" : "FAIL",
      submittedAt: Date.now(),
      levelUnlocked: getLevelUnlock(exam.level, passed),
      reviewed: exam.questions.some((q) => q.correctAnswer === "manual-review")
    };

    const nextUser = {
      ...state.currentUser,
      currentLevel: result.levelUnlocked
    };

    const updatedUsers = state.users.map((user) => (user.id === nextUser.id ? nextUser : user));

    updateState((prev) => ({
      ...prev,
      users: updatedUsers,
      currentUser: nextUser,
      activeSession: null,
      results: [result, ...prev.results]
    }));
    return result;
  };

  const forceFailActiveExam = (reason: string): ExamResult | null => {
    if (!state.currentUser || !state.activeSession) {
      return null;
    }

    const exam = getActiveExam();
    if (!exam) {
      return null;
    }

    const result: ExamResult = {
      id: crypto.randomUUID(),
      examId: exam.id,
      userId: state.currentUser.id,
      score: 0,
      totalMarks: exam.totalMarks,
      percentage: 0,
      status: "FAIL",
      submittedAt: Date.now(),
      levelUnlocked: exam.level,
      reviewed: false,
      terminatedByPolicy: true,
      failureReason: reason
    };

    updateState((prev) => ({
      ...prev,
      activeSession: null,
      results: [result, ...prev.results],
      proctorSession: prev.proctorSession
        ? {
            ...prev.proctorSession,
            policyTerminated: true,
            status: "ENDED",
            endedAt: Date.now()
          }
        : prev.proctorSession
    }));

    return result;
  };

  const value = useMemo<PortalContextValue>(
    () => ({
      ...state,
      login,
      logout,
      startExam,
      activateExamSession,
      saveAnswer,
      submitExam,
      markReview,
      updateProctorStatus,
      addProctorEvent,
      startProctorSession,
      updateProctorSession,
      endProctorSession,
      addRecordingChunk,
      updateRecordingChunkStatus,
      forceFailActiveExam,
      getExamById,
      getActiveExam,
      getQuestionById
    }),
    [state]
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}
