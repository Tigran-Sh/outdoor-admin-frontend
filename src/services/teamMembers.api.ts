import httpClient from "./httpClient";

import type { PaginatedResponse } from "@/types/adminUser";
import {
  buildTeamMemberFormData,
  mapTeamMemberFromApi,
  type TeamMember,
  type TeamMemberApi,
  type TeamMemberFormMode,
  type TeamMemberFormValues,
  type TeamMemberListParams,
} from "@/types/teamMember";

const BASE_URL = "/api/v1/club/team-members/";

export async function listTeamMembers(
  params: TeamMemberListParams = {},
): Promise<PaginatedResponse<TeamMember>> {
  const { data } = await httpClient.get<PaginatedResponse<TeamMemberApi>>(BASE_URL, { params });
  return { ...data, results: data.results.map(mapTeamMemberFromApi) };
}

export async function getTeamMember(id: string): Promise<TeamMember> {
  const { data } = await httpClient.get<TeamMemberApi>(`${BASE_URL}${id}/`);
  return mapTeamMemberFromApi(data);
}

export async function createTeamMember(values: TeamMemberFormValues): Promise<TeamMember> {
  const { data } = await httpClient.post<TeamMemberApi>(
    BASE_URL,
    buildTeamMemberFormData(values, "create"),
  );
  return mapTeamMemberFromApi(data);
}

export async function updateTeamMember(
  id: string,
  values: TeamMemberFormValues,
  mode: TeamMemberFormMode = "edit",
): Promise<TeamMember> {
  const { data } = await httpClient.patch<TeamMemberApi>(
    `${BASE_URL}${id}/`,
    buildTeamMemberFormData(values, mode),
  );
  return mapTeamMemberFromApi(data);
}

export async function setTeamMemberActive(id: string, isActive: boolean): Promise<TeamMember> {
  const formData = new FormData();
  formData.append("is_active", String(isActive));
  const { data } = await httpClient.patch<TeamMemberApi>(`${BASE_URL}${id}/`, formData);
  return mapTeamMemberFromApi(data);
}
