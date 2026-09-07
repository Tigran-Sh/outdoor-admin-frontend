import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";
import type { ActivityTypeId } from "@/constants/activityTypes";
import type { RegionCode } from "@/constants/regions";

export const ENTITY_TYPES = ["individual", "soleTrader", "llc", "informal"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

const ENTITY_TYPE_API_VALUES: Record<EntityType, string> = {
  individual: "individual",
  soleTrader: "sole_trader",
  llc: "llc",
  informal: "informal",
};
const ENTITY_TYPE_FROM_API: Record<string, EntityType> = Object.fromEntries(
  Object.entries(ENTITY_TYPE_API_VALUES).map(([id, api]) => [api, id]),
) as Record<string, EntityType>;

export function entityTypeToApi(id: string): string {
  return ENTITY_TYPE_API_VALUES[id as EntityType] ?? id;
}
export function entityTypeFromApi(value: string): EntityType {
  return ENTITY_TYPE_FROM_API[value] ?? (value as EntityType);
}

const REGION_API_VALUES: Record<RegionCode, string> = {
  yerevan: "yerevan",
  aragatsotn: "aragatsotn",
  ararat: "ararat",
  armavir: "armavir",
  gegharkunik: "gegharkunik",
  kotayk: "kotayk",
  lori: "lori",
  shirak: "shirak",
  syunik: "syunik",
  tavush: "tavush",
  vayotsDzor: "vayots_dzor",
};
const REGION_FROM_API: Record<string, RegionCode> = Object.fromEntries(
  Object.entries(REGION_API_VALUES).map(([id, api]) => [api, id]),
) as Record<string, RegionCode>;

export function regionToApi(id: string): string {
  return REGION_API_VALUES[id as RegionCode] ?? id;
}
export function regionFromApi(value: string): RegionCode {
  return REGION_FROM_API[value] ?? (value as RegionCode);
}

const ACTIVITY_TYPE_API_VALUES: Record<string, string> = {
  hiking: "hiking",
  trailRunning: "trail_running",
  cycling: "cycling",
  climbing: "climbing",
  zipline: "zipline",
  skydiving: "skydiving",
  parachuting: "parachuting",
  paragliding: "paragliding",
  hangGliding: "hang_gliding",
  supBoarding: "sup_boarding",
  yachting: "yachting",
  surfing: "surfing",
  kayaking: "kayaking",
  rafting: "rafting",
  canyoneering: "canyoneering",
  wakeboarding: "wakeboarding",
  skiing: "skiing",
  snowboarding: "snowboarding",
  other: "other",
};
const ACTIVITY_TYPE_FROM_API: Record<string, ActivityTypeId> = Object.fromEntries(
  Object.entries(ACTIVITY_TYPE_API_VALUES).map(([id, api]) => [api, id]),
) as Record<string, ActivityTypeId>;

export function activityTypeToApi(id: string): string {
  return ACTIVITY_TYPE_API_VALUES[id] ?? id;
}
export function activityTypeFromApi(value: string): ActivityTypeId {
  return ACTIVITY_TYPE_FROM_API[value] ?? (value as ActivityTypeId);
}

export const CLUB_STATUSES = [
  "draft",
  "pendingApproval",
  "approved",
  "rejected",
  "suspended",
] as const;
export type ClubStatus = (typeof CLUB_STATUSES)[number];

const CLUB_STATUS_API_VALUES: Record<ClubStatus, string> = {
  draft: "draft",
  pendingApproval: "pending_approval",
  approved: "approved",
  rejected: "rejected",
  suspended: "suspended",
};
const CLUB_STATUS_FROM_API: Record<string, ClubStatus> = Object.fromEntries(
  Object.entries(CLUB_STATUS_API_VALUES).map(([id, api]) => [api, id]),
) as Record<string, ClubStatus>;

export function clubStatusToApi(status: ClubStatus): string {
  return CLUB_STATUS_API_VALUES[status];
}
export function clubStatusFromApi(value: string): ClubStatus {
  return CLUB_STATUS_FROM_API[value] ?? (value as ClubStatus);
}

export const CLUB_STATUS_BADGE_VARIANT: Record<ClubStatus, BadgeVariant> = {
  draft: "secondary",
  pendingApproval: "warning",
  approved: "success",
  rejected: "danger",
  suspended: "dark",
};

/** Verification-derived badge, independent from the workflow `status` field above. */
export type ClubVerificationStatus = "pending" | "identityVerified" | "fullyVerified";

export function getClubVerificationStatus(club: {
  identityVerified: boolean;
  paymentVerified: boolean;
}): ClubVerificationStatus {
  if (club.identityVerified && club.paymentVerified) return "fullyVerified";
  if (club.identityVerified) return "identityVerified";
  return "pending";
}

export const CLUB_VERIFICATION_BADGE_VARIANT: Record<ClubVerificationStatus, BadgeVariant> = {
  pending: "warning",
  identityVerified: "info",
  fullyVerified: "success",
};

export const MISSING_PROFILE_FIELDS = [
  "name",
  "logo",
  "about",
  "activity_types",
  "base_region",
  "email",
  "phone",
  "entity_type",
  "tax_id",
  "owner_id_document",
  "social_links",
] as const;
export type MissingProfileField = (typeof MISSING_PROFILE_FIELDS)[number];

/** Wire (snake_case) shape, exactly as returned by the backend. */
export interface ClubApi {
  id: string;
  name: string;
  status: string;
  owner: string;
  owner_email: string;
  logo: string | null;
  cover_image: string | null;
  about: string;
  activity_types: string[];
  base_region: string;
  year_founded: number | null;
  email: string;
  phone: string;
  instagram: string;
  facebook: string;
  telegram: string;
  website: string;
  entity_type: string;
  tax_id: string;
  has_owner_id_document: boolean;
  identity_verified: boolean;
  payment_verified: boolean;
  missing_profile_fields: string[];
  created_at: string;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  status: ClubStatus;
  owner: string;
  ownerEmail: string;
  logo: string | null;
  coverImage: string | null;
  about: string;
  activityTypeIds: ActivityTypeId[];
  baseRegion: RegionCode;
  yearFounded: number | null;
  email: string;
  phone: string;
  instagram: string;
  facebook: string;
  telegram: string;
  website: string;
  entityType: EntityType;
  taxId: string;
  hasOwnerIdDocument: boolean;
  identityVerified: boolean;
  paymentVerified: boolean;
  missingProfileFields: MissingProfileField[];
  createdAt: string;
  updatedAt: string;
}

export function mapClubFromApi(raw: ClubApi): Club {
  return {
    id: raw.id,
    name: raw.name,
    status: clubStatusFromApi(raw.status),
    owner: raw.owner,
    ownerEmail: raw.owner_email,
    logo: raw.logo,
    coverImage: raw.cover_image,
    about: raw.about,
    activityTypeIds: raw.activity_types.map(activityTypeFromApi),
    baseRegion: regionFromApi(raw.base_region),
    yearFounded: raw.year_founded,
    email: raw.email,
    phone: raw.phone,
    instagram: raw.instagram,
    facebook: raw.facebook,
    telegram: raw.telegram,
    website: raw.website,
    entityType: entityTypeFromApi(raw.entity_type),
    taxId: raw.tax_id,
    hasOwnerIdDocument: raw.has_owner_id_document,
    identityVerified: raw.identity_verified,
    paymentVerified: raw.payment_verified,
    missingProfileFields: raw.missing_profile_fields as MissingProfileField[],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/** A club owner not yet assigned a club -- the create form's owner picker. */
export interface AvailableOwnerApi {
  id: string;
  email: string;
  full_name: string;
}

export interface AvailableOwner {
  id: string;
  email: string;
  fullName: string;
}

export function mapAvailableOwnerFromApi(raw: AvailableOwnerApi): AvailableOwner {
  return { id: raw.id, email: raw.email, fullName: raw.full_name };
}

export const CLUB_ORDERING_FIELDS = ["created_at", "name"] as const;
export type ClubOrderingField = (typeof CLUB_ORDERING_FIELDS)[number];

export interface AdminClubListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  entity_type?: string;
  base_region?: string;
  status?: string;
  identity_verified?: boolean;
  payment_verified?: boolean;
}

/** Editable club-profile fields, in the camelCase shape used by the form. */
export interface ClubFormValues {
  name: string;
  /** New file to upload; empty means "keep the current logo". */
  logo: File[];
  /** New file to upload; empty means "keep the current cover image". */
  coverImage: File[];
  about: string;
  activityTypeIds: string[];
  baseRegion: string;
  yearFounded: string;
  email: string;
  phone: string;
  instagram: string;
  facebook: string;
  telegram: string;
  website: string;
  entityType: string;
  taxId: string;
  /** New file to upload; empty means "keep the current document". */
  ownerIdDocument: File[];
}

export const initialClubFormValues: ClubFormValues = {
  name: "",
  logo: [],
  coverImage: [],
  about: "",
  activityTypeIds: [],
  baseRegion: "",
  yearFounded: "",
  email: "",
  phone: "",
  instagram: "",
  facebook: "",
  telegram: "",
  website: "",
  entityType: "",
  taxId: "",
  ownerIdDocument: [],
};

export function clubToFormValues(club: Club): ClubFormValues {
  return {
    name: club.name,
    logo: [],
    coverImage: [],
    about: club.about,
    activityTypeIds: club.activityTypeIds,
    baseRegion: club.baseRegion,
    yearFounded: club.yearFounded ? String(club.yearFounded) : "",
    email: club.email,
    phone: club.phone,
    instagram: club.instagram,
    facebook: club.facebook,
    telegram: club.telegram,
    website: club.website,
    entityType: club.entityType,
    taxId: club.taxId,
    ownerIdDocument: [],
  };
}

/**
 * Builds the multipart payload for `PATCH /api/v1/club/`. Image fields are
 * only included when a new file was picked, so leaving them untouched never
 * clears the club's existing logo/cover/ID document.
 */
export function buildClubFormData(values: ClubFormValues): FormData {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("about", values.about);
  values.activityTypeIds.forEach((id) => formData.append("activity_types", activityTypeToApi(id)));
  formData.append("base_region", regionToApi(values.baseRegion));
  if (values.yearFounded !== "") formData.append("year_founded", values.yearFounded);
  formData.append("email", values.email);
  formData.append("phone", values.phone);
  formData.append("instagram", values.instagram);
  formData.append("facebook", values.facebook);
  formData.append("telegram", values.telegram);
  formData.append("website", values.website);
  formData.append("entity_type", entityTypeToApi(values.entityType));
  formData.append("tax_id", values.taxId);
  if (values.logo[0]) formData.append("logo", values.logo[0]);
  if (values.coverImage[0]) formData.append("cover_image", values.coverImage[0]);
  if (values.ownerIdDocument[0]) formData.append("owner_id_document", values.ownerIdDocument[0]);
  return formData;
}

/**
 * Builds the multipart payload for `POST /api/v1/admin/clubs/`: the same
 * full profile payload as `buildClubFormData`, plus the `owner` assigned by
 * the Platform Admin creating the club.
 */
export function buildAdminClubCreateFormData(values: ClubFormValues, ownerId: string): FormData {
  const formData = buildClubFormData(values);
  formData.append("owner", ownerId);
  return formData;
}

/** The staff-only fields a Platform Admin may additionally set on `PATCH /api/v1/admin/clubs/{id}/`. */
export interface AdminClubUpdateExtra {
  status: ClubStatus;
  identityVerified: boolean;
  paymentVerified: boolean;
}

/**
 * Builds the multipart payload for `PATCH /api/v1/admin/clubs/{id}/`: the
 * same full profile payload as `buildClubFormData`, plus the staff-only
 * `status`/`identity_verified`/`payment_verified` fields only a Platform
 * Admin may set.
 */
export function buildAdminClubUpdateFormData(
  values: ClubFormValues,
  extra: AdminClubUpdateExtra,
): FormData {
  const formData = buildClubFormData(values);
  formData.append("status", clubStatusToApi(extra.status));
  formData.append("identity_verified", String(extra.identityVerified));
  formData.append("payment_verified", String(extra.paymentVerified));
  return formData;
}
