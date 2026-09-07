import httpClient from "./httpClient";

import type { PaginatedResponse } from "@/types/adminUser";
import {
  buildAdminClubCreateFormData,
  buildAdminClubUpdateFormData,
  buildClubFormData,
  clubStatusToApi,
  mapAvailableOwnerFromApi,
  mapClubFromApi,
  type AdminClubListParams,
  type AdminClubUpdateExtra,
  type AvailableOwner,
  type AvailableOwnerApi,
  type Club,
  type ClubApi,
  type ClubFormValues,
  type ClubStatus,
} from "@/types/club";

const MY_CLUB_URL = "/api/v1/club/";
const ADMIN_CLUBS_URL = "/api/v1/admin/clubs/";

export async function getMyClub(): Promise<Club> {
  const { data } = await httpClient.get<ClubApi>(MY_CLUB_URL);
  return mapClubFromApi(data);
}

export async function updateMyClub(values: ClubFormValues): Promise<Club> {
  const { data } = await httpClient.patch<ClubApi>(MY_CLUB_URL, buildClubFormData(values));
  return mapClubFromApi(data);
}

export async function listAdminClubs(
  params: AdminClubListParams = {},
): Promise<PaginatedResponse<Club>> {
  const { data } = await httpClient.get<PaginatedResponse<ClubApi>>(ADMIN_CLUBS_URL, { params });
  return { ...data, results: data.results.map(mapClubFromApi) };
}

export async function getAdminClub(id: string): Promise<Club> {
  const { data } = await httpClient.get<ClubApi>(`${ADMIN_CLUBS_URL}${id}/`);
  return mapClubFromApi(data);
}

export async function createAdminClub(values: ClubFormValues, ownerId: string): Promise<Club> {
  const { data } = await httpClient.post<ClubApi>(
    ADMIN_CLUBS_URL,
    buildAdminClubCreateFormData(values, ownerId),
  );
  return mapClubFromApi(data);
}

export async function updateAdminClub(
  id: string,
  values: ClubFormValues,
  extra: AdminClubUpdateExtra,
): Promise<Club> {
  const { data } = await httpClient.patch<ClubApi>(
    `${ADMIN_CLUBS_URL}${id}/`,
    buildAdminClubUpdateFormData(values, extra),
  );
  return mapClubFromApi(data);
}

/** Lightweight partial update used by the Deactivate/Activate row action. */
export async function setClubStatus(id: string, status: ClubStatus): Promise<Club> {
  const { data } = await httpClient.patch<ClubApi>(`${ADMIN_CLUBS_URL}${id}/`, {
    status: clubStatusToApi(status),
  });
  return mapClubFromApi(data);
}

export async function listAvailableClubOwners(search?: string): Promise<AvailableOwner[]> {
  const { data } = await httpClient.get<AvailableOwnerApi[]>(
    `${ADMIN_CLUBS_URL}available-owners/`,
    { params: search ? { search } : undefined },
  );
  return data.map(mapAvailableOwnerFromApi);
}

export async function fetchClubIdDocument(clubId: string): Promise<Blob> {
  const { data } = await httpClient.get<Blob>(`/api/v1/club/${clubId}/id-document/`, {
    responseType: "blob",
  });
  return data;
}
