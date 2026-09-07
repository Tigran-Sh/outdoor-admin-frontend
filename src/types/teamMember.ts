import type { LanguageCode } from "@/app/i18n/languages";
import type { ActivityTypeId } from "@/constants/activityTypes";
import type { Capability, Role } from "@/types/auth";
import { activityTypeFromApi, activityTypeToApi } from "@/types/club";

export const TEAM_LANGUAGES: LanguageCode[] = ["en", "hy", "ru"];

/** Platform roles a Club Owner may provision for a team member. */
export const TEAM_MEMBER_PLATFORM_ROLES: Role[] = ["guide", "internal_admin"];

export interface TeamMemberCertificateApi {
  id: string;
  file: string;
  created_at: string;
}

export interface TeamMemberCertificate {
  id: string;
  fileUrl: string;
  createdAt: string;
}

export interface TeamMemberApi {
  id: string;
  club: string;
  user: string;
  email: string;
  full_name: string;
  platform_role: string;
  account_is_active: boolean;
  permissions: string[];
  activity_types: string[];
  languages: string[];
  photo: string | null;
  phone: string;
  birth_date: string | null;
  experience_years: number | null;
  bio: string;
  certificates: TeamMemberCertificateApi[];
  is_active: boolean;
  joined_date: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  club: string;
  user: string;
  email: string;
  fullName: string;
  platformRole: Role;
  accountIsActive: boolean;
  permissions: Capability[];
  activityTypeIds: ActivityTypeId[];
  languageIds: LanguageCode[];
  photo: string | null;
  phone: string;
  birthDate: string | null;
  experienceYears: number | null;
  bio: string;
  certificates: TeamMemberCertificate[];
  isActive: boolean;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export function mapTeamMemberFromApi(raw: TeamMemberApi): TeamMember {
  return {
    id: raw.id,
    club: raw.club,
    user: raw.user,
    email: raw.email,
    fullName: raw.full_name,
    platformRole: raw.platform_role as Role,
    accountIsActive: raw.account_is_active,
    permissions: raw.permissions as Capability[],
    activityTypeIds: raw.activity_types.map(activityTypeFromApi),
    languageIds: raw.languages as LanguageCode[],
    photo: raw.photo,
    phone: raw.phone,
    birthDate: raw.birth_date,
    experienceYears: raw.experience_years,
    bio: raw.bio,
    certificates: raw.certificates.map((certificate) => ({
      id: certificate.id,
      fileUrl: certificate.file,
      createdAt: certificate.created_at,
    })),
    isActive: raw.is_active,
    joinedDate: raw.joined_date,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const TEAM_MEMBER_ORDERING_FIELDS = [
  "created_at",
  "user__full_name",
  "user__email",
] as const;
export type TeamMemberOrderingField = (typeof TEAM_MEMBER_ORDERING_FIELDS)[number];

export interface TeamMemberListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export type TeamMemberFormMode = "create" | "edit";

export interface TeamMemberFormValues {
  fullName: string;
  email: string;
  password: string;
  platformRole: string;
  permissions: string[];
  activityTypeIds: string[];
  languageIds: string[];
  phone: string;
  birthDate: string;
  experienceYears: string;
  bio: string;
  photo: File[];
  certificates: File[];
  isActive: boolean;
}

export const initialTeamMemberFormValues: TeamMemberFormValues = {
  fullName: "",
  email: "",
  password: "",
  platformRole: "guide",
  permissions: [],
  activityTypeIds: [],
  languageIds: [],
  phone: "",
  birthDate: "",
  experienceYears: "",
  bio: "",
  photo: [],
  certificates: [],
  isActive: true,
};

export function teamMemberToFormValues(member: TeamMember): TeamMemberFormValues {
  return {
    fullName: member.fullName,
    email: member.email,
    password: "",
    platformRole: member.platformRole,
    permissions: member.permissions,
    activityTypeIds: member.activityTypeIds,
    languageIds: member.languageIds,
    phone: member.phone,
    birthDate: member.birthDate ?? "",
    experienceYears: member.experienceYears != null ? String(member.experienceYears) : "",
    bio: member.bio,
    photo: [],
    certificates: [],
    isActive: member.isActive,
  };
}

/**
 * Builds the multipart payload for the create/update team-member endpoints.
 * `permissions` is only sent for the `internal_admin` platform role: a
 * `guide` uses its fixed role defaults and the backend rejects any custom
 * permissions submitted for it.
 */
export function buildTeamMemberFormData(
  values: TeamMemberFormValues,
  mode: TeamMemberFormMode,
): FormData {
  const formData = new FormData();
  formData.append("full_name", values.fullName);
  formData.append("email", values.email);

  if (mode === "create") {
    formData.append("password", values.password);
    formData.append("platform_role", values.platformRole);
  }

  if (values.platformRole === "internal_admin") {
    values.permissions.forEach((permission) => formData.append("permissions", permission));
  }

  values.activityTypeIds.forEach((id) => formData.append("activity_types", activityTypeToApi(id)));
  values.languageIds.forEach((id) => formData.append("languages", id));

  formData.append("phone", values.phone);
  if (values.birthDate) formData.append("birth_date", values.birthDate);
  if (values.experienceYears !== "") formData.append("experience_years", values.experienceYears);
  formData.append("bio", values.bio);
  formData.append("is_active", String(values.isActive));

  if (values.photo[0]) formData.append("photo", values.photo[0]);
  values.certificates.forEach((file) => formData.append("certificates", file));

  return formData;
}
