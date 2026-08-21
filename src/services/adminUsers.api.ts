import httpClient from "./httpClient";

import type {
  AdminUser,
  AdminUserListParams,
  CreateAdminUserRequest,
  PaginatedResponse,
  UpdateAdminUserRequest,
  UpdateCapabilitiesRequest,
  UpdateRoleRequest,
} from "@/types/adminUser";

const BASE_URL = "/api/v1/admin/users/";

export async function listUsers(
  params: AdminUserListParams = {},
): Promise<PaginatedResponse<AdminUser>> {
  const { data } = await httpClient.get<PaginatedResponse<AdminUser>>(BASE_URL, { params });
  return data;
}

export async function getUser(id: string): Promise<AdminUser> {
  const { data } = await httpClient.get<AdminUser>(`${BASE_URL}${id}/`);
  return data;
}

export async function createUser(payload: CreateAdminUserRequest): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(BASE_URL, payload);
  return data;
}

export async function updateUser(
  id: string,
  payload: UpdateAdminUserRequest,
): Promise<AdminUser> {
  const { data } = await httpClient.patch<AdminUser>(`${BASE_URL}${id}/`, payload);
  return data;
}

export async function activateUser(id: string): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(`${BASE_URL}${id}/activate/`);
  return data;
}

export async function deactivateUser(id: string): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(`${BASE_URL}${id}/deactivate/`);
  return data;
}

export async function updateUserRole(
  id: string,
  payload: UpdateRoleRequest,
): Promise<AdminUser> {
  const { data } = await httpClient.patch<AdminUser>(`${BASE_URL}${id}/role/`, payload);
  return data;
}

export async function updateUserCapabilities(
  id: string,
  payload: UpdateCapabilitiesRequest,
): Promise<AdminUser> {
  const { data } = await httpClient.patch<AdminUser>(`${BASE_URL}${id}/capabilities/`, payload);
  return data;
}
