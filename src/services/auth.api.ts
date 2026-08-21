import httpClient from "./httpClient";

import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  User,
} from "@/types/auth";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>("/api/v1/auth/login/", payload);
  return data;
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  const { data } = await httpClient.post<RefreshResponse>("/api/v1/auth/refresh/", {
    refresh: refreshToken,
  });
  return data;
}

export async function logout(refreshToken: string): Promise<void> {
  await httpClient.post("/api/v1/auth/logout/", { refresh: refreshToken });
}

export async function getMe(): Promise<User> {
  const { data } = await httpClient.get<User>("/api/v1/auth/me/");
  return data;
}

export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const { data } = await httpClient.post<ChangePasswordResponse>(
    "/api/v1/auth/change-password/",
    payload,
  );
  return data;
}
