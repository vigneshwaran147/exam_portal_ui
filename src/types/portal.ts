import type { Company, UserProfile } from "@/types/auth";
import type { Exam, ExamQuestion, ExamResult, UserAnswerValue } from "@/types/exam";

export type ProctoringStatus = {
  camera: "idle" | "connected" | "blocked";
  microphone: "idle" | "connected" | "blocked";
  screenShare: "idle" | "active" | "blocked";
  fullscreen: "inactive" | "active";
  recording: "idle" | "active" | "error";
  network: "online" | "offline";
  face: "unknown" | "detected" | "missing";
  head: "stable" | "moving";
  audioEnvironment: "quiet" | "noisy";
  tabSwitchCount: number;
};

export type ViolationSeverity = "low" | "medium" | "high";

export type ProctorEvent = {
  id: string;
  timestamp: number;
  type:
    | "TAB_SWITCH"
    | "EXIT_FULLSCREEN"
    | "CAMERA_BLOCKED"
    | "MIC_BLOCKED"
    | "SCREENSHARE_STOPPED"
    | "RECORDING_STARTED"
    | "RECORDING_STOPPED"
    | "RECORDING_FAILED"
    | "UPLOAD_FAILED"
    | "UPLOAD_SUCCESS"
    | "NETWORK_OFFLINE"
    | "NETWORK_RESTORED"
    | "BACKGROUND_NOISE"
    | "HEAD_MOVEMENT"
    | "FACE_MISSING"
    | "MULTIPLE_FACE_ALERT"
    | "LOOKING_AWAY_ALERT";
  severity: ViolationSeverity;
  message: string;
  examId: string;
  userId: string;
};

export type RecordingUploadStatus = "pending" | "uploading" | "uploaded" | "failed";

export type RecordingChunk = {
  id: string;
  sessionId: string;
  employeeId: string;
  examId: string;
  mediaType: "video" | "audio";
  sequence: number;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  fileName: string;
  fileSize: number;
  checksum: string;
  uploadStatus: RecordingUploadStatus;
  retryCount: number;
};

export type ProctorSessionStatus = "IDLE" | "INITIALIZING" | "ACTIVE" | "ERROR" | "STOPPED" | "ENDED";

export type ProctorSession = {
  sessionId: string;
  examId: string;
  employeeId: string;
  startedAt: number | null;
  endedAt: number | null;
  status: ProctorSessionStatus;
  uploadInProgress: boolean;
  pendingChunks: number;
  uploadedChunks: number;
  failedChunks: number;
  lastHeartbeat: number | null;
  violationScore: number;
  warningCount: number;
  policyTerminated: boolean;
};

export type ExamSession = {
  examId: string;
  startedAt: number | null;
  answers: Record<string, UserAnswerValue>;
  isSubmitted: boolean;
  savedAt: number;
};

export type PortalState = {
  companies: Company[];
  users: UserProfile[];
  currentUser: UserProfile | null;
  exams: Exam[];
  activeSession: ExamSession | null;
  results: ExamResult[];
  proctorStatus: ProctoringStatus;
  proctorEvents: ProctorEvent[];
  proctorSession: ProctorSession | null;
  recordingChunks: RecordingChunk[];
};

export type PortalContextValue = PortalState & {
  login: (employeeId: string, password: string, selectedRole?: UserProfile["role"]) => { success: boolean; message?: string };
  logout: () => void;
  startExam: (examId: string) => void;
  activateExamSession: () => void;
  saveAnswer: (questionId: string, value: UserAnswerValue) => void;
  submitExam: () => ExamResult | null;
  markReview: (questionId: string, marked: boolean) => void;
  updateProctorStatus: (status: Partial<ProctoringStatus>) => void;
  addProctorEvent: (event: Omit<ProctorEvent, "id" | "timestamp" | "userId">) => void;
  startProctorSession: (examId: string) => string | null;
  updateProctorSession: (status: Partial<ProctorSession>) => void;
  endProctorSession: (status?: ProctorSessionStatus) => void;
  addRecordingChunk: (chunk: Omit<RecordingChunk, "id" | "uploadStatus" | "retryCount">) => string;
  updateRecordingChunkStatus: (chunkId: string, uploadStatus: RecordingUploadStatus, retryCount?: number) => void;
  forceFailActiveExam: (reason: string) => ExamResult | null;
  getExamById: (examId: string) => Exam | undefined;
  getActiveExam: () => Exam | undefined;
  getQuestionById: (exam: Exam, questionId: string) => ExamQuestion | undefined;
  addCompany: (company: Omit<Company, "id" | "createdAt">) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  addEmployee: (employee: Omit<UserProfile, "id">) => void;
  updateEmployee: (id: string, updates: Partial<UserProfile>) => void;
};
