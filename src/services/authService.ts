import { apiClient } from "@/api/client";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/logout");
}
