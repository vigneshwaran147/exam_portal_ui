export type QuestionType =
  | "MCQ"
  | "MULTI_SELECT"
  | "TRUE_FALSE"
  | "DESCRIPTIVE"
  | "FILL_BLANK"
  | "CASE_STUDY";

export type UserAnswerValue = string | string[];

export type ExamSummary = {
  id: string;
  title: string;
  level: 0 | 1 | 2;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
};

export type ExamQuestion = {
  id: string;
  type: QuestionType;
  marks: number;
  questionText: string;
  options?: string[];
  correctAnswer: UserAnswerValue | "manual-review";
};

export type Exam = ExamSummary & {
  assignedTo: string[];
  questions: ExamQuestion[];
};

export type ExamResult = {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: "PASS" | "FAIL";
  submittedAt: number;
  levelUnlocked: 0 | 1 | 2;
  reviewed: boolean;
  terminatedByPolicy?: boolean;
  failureReason?: string;
};
