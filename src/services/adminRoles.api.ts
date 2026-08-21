import httpClient from "./httpClient";

import type { Role } from "@/types/auth";
import type { CapabilityDefinition, RoleDefinition } from "@/types/adminUser";

export async function listRoles(): Promise<RoleDefinition[]> {
  const { data } = await httpClient.get<RoleDefinition[]>("/api/v1/admin/roles/");
  return data;
}

export async function getRole(role: Role): Promise<RoleDefinition> {
  const { data } = await httpClient.get<RoleDefinition>(`/api/v1/admin/roles/${role}/`);
  return data;
}

export async function listRoleCapabilities(role: Role): Promise<CapabilityDefinition[]> {
  const { data } = await httpClient.get<CapabilityDefinition[]>(
    `/api/v1/admin/roles/${role}/capabilities/`,
  );
  return data;
}

export async function listCapabilities(): Promise<CapabilityDefinition[]> {
  const { data } = await httpClient.get<CapabilityDefinition[]>("/api/v1/admin/capabilities/");
  return data;
}
