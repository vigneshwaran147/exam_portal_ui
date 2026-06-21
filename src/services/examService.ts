import { apiClient } from "@/api/client";
import type { ExamSummary, ExamQuestion } from "@/types/exam";

export async function getExamList(): Promise<ExamSummary[]> {
  const { data } = await apiClient.get<ExamSummary[]>("/exam/list");
  return data;
}

export async function getExamQuestions(examId: string): Promise<ExamQuestion[]> {
  const { data } = await apiClient.get<ExamQuestion[]>(`/exam/${examId}/questions`);
  return data;
}
