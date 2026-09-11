import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";
import { ACTIVITY_TYPES, type ActivityTypeOption } from "@/constants/activityTypes";
import { REGIONS, type RegionCode } from "@/constants/regions";
import { activityTypeFromApi, activityTypeToApi, regionFromApi, regionToApi } from "@/types/club";

import type { EventFormValues } from "@/pages/events/EventForm.schema";

export const EVENT_CATEGORIES: ActivityTypeOption[] = ACTIVITY_TYPES;
export const EVENT_REGIONS = REGIONS;

export const EVENT_LANGUAGES = ["en", "hy", "ru"] as const;
export type EventLanguage = (typeof EVENT_LANGUAGES)[number];

export const EVENT_DIFFICULTIES = ["easy", "medium", "hard", "extreme"] as const;
export type EventDifficulty = (typeof EVENT_DIFFICULTIES)[number];

export const EVENT_PRICE_TYPES = ["free", "paid"] as const;
export type EventPriceType = (typeof EVENT_PRICE_TYPES)[number];

export const EVENT_DURATION_TYPES = ["single", "multi"] as const;
export type EventDurationType = (typeof EVENT_DURATION_TYPES)[number];

export const EVENT_STATUSES = ["draft", "published", "cancelled", "completed"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_STATUS_BADGE_VARIANT: Record<EventStatus, BadgeVariant> = {
  draft: "secondary",
  published: "success",
  cancelled: "danger",
  completed: "info",
};

export interface EventGuideOption {
  id: string;
  name: string;
}

/**
 * The cancel dialog keeps its existing camelCase reason ids (and i18n keys)
 * unchanged; only the wire value sent to the backend differs.
 */
export const EVENT_CANCELLATION_REASONS = [
  "lowRegistrations",
  "weatherConditions",
  "guideUnavailable",
  "safetyConcerns",
  "other",
] as const;
export type EventCancellationReason = (typeof EVENT_CANCELLATION_REASONS)[number];

/** Max length for the free-text reason when `reason` is `"other"`. */
export const CANCEL_REASON_OTHER_MAX_LENGTH = 50;

const CANCELLATION_REASON_API_VALUES: Record<EventCancellationReason, string> = {
  lowRegistrations: "not_enough_participants",
  weatherConditions: "weather",
  guideUnavailable: "guide_unavailable",
  safetyConcerns: "safety",
  other: "other",
};
const CANCELLATION_REASON_FROM_API: Record<string, EventCancellationReason> = Object.fromEntries(
  Object.entries(CANCELLATION_REASON_API_VALUES).map(([id, api]) => [api, id]),
) as Record<string, EventCancellationReason>;

export function cancellationReasonToApi(id: string): string {
  return CANCELLATION_REASON_API_VALUES[id as EventCancellationReason] ?? id;
}
export function cancellationReasonFromApi(value: string): EventCancellationReason | "" {
  if (!value) return "";
  return CANCELLATION_REASON_FROM_API[value] ?? (value as EventCancellationReason);
}

export interface EventGalleryImageApi {
  id: string;
  image: string;
  order: number;
}

export interface EventGalleryImage {
  id: string;
  image: string;
  order: number;
}

export interface EventApi {
  id: string;
  club: string;
  club_name: string;
  status: string;
  title: string;
  description: string;
  category: string;
  cover_image: string | null;
  gallery_images: EventGalleryImageApi[];
  start_at: string | null;
  duration_type: string;
  end_at: string | null;
  languages: string[];
  region: string;
  difficulty: string;
  distance_km: string | null;
  elevation_gain_m: number | null;
  meeting_point_lat: string | null;
  meeting_point_lng: string | null;
  meeting_point_url: string;
  meeting_point_note: string;
  guide: string | null;
  guide_name: string | null;
  required_items: string[];
  price_type: string;
  price: string | null;
  max_participants: number | null;
  sold_count: number;
  is_sold_out: boolean;
  included: string;
  not_included: string;
  cancellation_terms: string;
  other_info: string;
  cancellation_reason: string;
  cancellation_reason_other: string;
  cancelled_at: string | null;
  missing_to_publish: string[];
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  club: string;
  clubName: string;
  status: EventStatus;
  title: string;
  description: string;
  category: string;
  coverImage: string | null;
  galleryImages: EventGalleryImage[];
  startAt: string | null;
  durationType: EventDurationType;
  endAt: string | null;
  languages: EventLanguage[];
  region: RegionCode;
  difficulty: EventDifficulty | "";
  distanceKm: string;
  elevationGainM: string;
  meetingPointLat: string;
  meetingPointLng: string;
  meetingPointUrl: string;
  meetingPointNote: string;
  guide: string;
  guideName: string;
  requiredItems: string[];
  priceType: EventPriceType | "";
  price: string;
  maxParticipants: string;
  soldCount: number;
  isSoldOut: boolean;
  included: string;
  notIncluded: string;
  cancellationTerms: string;
  otherInfo: string;
  cancellationReason: EventCancellationReason | "";
  cancellationReasonOther: string;
  cancelledAt: string | null;
  missingToPublish: string[];
  createdAt: string;
  updatedAt: string;
}

export function mapEventFromApi(raw: EventApi): Event {
  return {
    id: raw.id,
    club: raw.club,
    clubName: raw.club_name,
    status: raw.status as EventStatus,
    title: raw.title,
    description: raw.description,
    category: activityTypeFromApi(raw.category),
    coverImage: raw.cover_image,
    galleryImages: raw.gallery_images,
    startAt: raw.start_at,
    durationType: raw.duration_type as EventDurationType,
    endAt: raw.end_at,
    languages: raw.languages as EventLanguage[],
    region: regionFromApi(raw.region),
    difficulty: (raw.difficulty as EventDifficulty) || "",
    distanceKm: raw.distance_km ?? "",
    elevationGainM: raw.elevation_gain_m != null ? String(raw.elevation_gain_m) : "",
    meetingPointLat: raw.meeting_point_lat ?? "",
    meetingPointLng: raw.meeting_point_lng ?? "",
    meetingPointUrl: raw.meeting_point_url,
    meetingPointNote: raw.meeting_point_note,
    guide: raw.guide ?? "",
    guideName: raw.guide_name ?? "",
    requiredItems: raw.required_items,
    priceType: (raw.price_type as EventPriceType) || "",
    price: raw.price ?? "",
    maxParticipants: raw.max_participants != null ? String(raw.max_participants) : "",
    soldCount: raw.sold_count,
    isSoldOut: raw.is_sold_out,
    included: raw.included,
    notIncluded: raw.not_included,
    cancellationTerms: raw.cancellation_terms,
    otherInfo: raw.other_info,
    cancellationReason: cancellationReasonFromApi(raw.cancellation_reason),
    cancellationReasonOther: raw.cancellation_reason_other,
    cancelledAt: raw.cancelled_at,
    missingToPublish: raw.missing_to_publish,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const EVENT_ORDERING_FIELDS = ["start_at", "created_at", "title"] as const;
export type EventOrderingField = (typeof EVENT_ORDERING_FIELDS)[number];

/** Platform Admin only -- the club-scoped events list has no "club" column to sort by. */
export const ADMIN_EVENT_ORDERING_FIELDS = [...EVENT_ORDERING_FIELDS, "club__name"] as const;
export type AdminEventOrderingField = (typeof ADMIN_EVENT_ORDERING_FIELDS)[number];

export interface EventListParams {
  page?: number;
  page_size?: number;
  status?: string;
  category?: string;
  region?: string;
  difficulty?: string;
  /** Platform Admin only -- a specific club's UUID, e.g. from a club picker. */
  club?: string;
  /** Platform Admin only -- partial, case-insensitive club name filter. */
  club_name?: string;
  search?: string;
  ordering?: string;
}

/** Splits "lat, lng" (as typed in the single coordinates field) into two decimal strings. */
function parseCoordinates(value: string): { lat: string; lng: string } | null {
  const parts = value.split(",").map((part) => part.trim());
  if (parts.length !== 2) return null;
  const [lat, lng] = parts;
  if (!lat || !lng || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return null;
  return { lat, lng };
}

/**
 * Builds the multipart payload sent to `POST/PATCH /api/v1/events/`.
 *
 * Only fields with an actual value are included, so partial saves from an
 * earlier/later wizard step are never overwritten with blanks.
 * `sweepGuideId` has no backend equivalent and is intentionally never sent
 * (the UI field stays, per the existing wizard, it just isn't persisted --
 * same as `team_role` used to be harmless-but-ignored).
 */
export function buildEventFormData(values: EventFormValues, club?: string): FormData {
  const formData = new FormData();

  if (club) formData.append("club", club);

  formData.append("title", values.name);
  if (values.description) formData.append("description", values.description);
  if (values.category) formData.append("category", activityTypeToApi(values.category));
  if (values.region) formData.append("region", regionToApi(values.region));

  if (values.date && values.time) {
    formData.append("start_at", `${values.date}T${values.time}:00`);
  }
  if (values.durationType) formData.append("duration_type", values.durationType);
  if (values.durationType === "multi" && values.endDate) {
    formData.append("end_at", `${values.endDate}T${values.time || "00:00"}:00`);
  }

  values.languageIds.forEach((id) => formData.append("languages", id));

  if (values.difficultyIds[0]) formData.append("difficulty", values.difficultyIds[0]);
  if (values.distanceKm !== "") formData.append("distance_km", values.distanceKm);
  if (values.elevationGainM !== "") formData.append("elevation_gain_m", values.elevationGainM);

  if (values.meetingPointDescription) {
    formData.append("meeting_point_note", values.meetingPointDescription);
  }
  const coordinates = parseCoordinates(values.meetingPointCoordinates);
  if (coordinates) {
    formData.append("meeting_point_lat", coordinates.lat);
    formData.append("meeting_point_lng", coordinates.lng);
  }

  if (values.guideId) formData.append("guide", values.guideId);

  const requiredItems = values.whatIsNecessary
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  requiredItems.forEach((item) => formData.append("required_items", item));

  if (values.priceType) formData.append("price_type", values.priceType);
  if (values.priceType === "paid" && values.price !== "") {
    formData.append("price", values.price);
  }
  if (values.maxParticipants !== "") formData.append("max_participants", values.maxParticipants);

  if (values.includedItems) formData.append("included", values.includedItems);
  if (values.excludedItems) formData.append("not_included", values.excludedItems);
  if (values.cancellationPolicy) {
    formData.append("cancellation_terms", values.cancellationPolicy);
  }
  if (values.additionalInfo) formData.append("other_info", values.additionalInfo);

  if (values.coverImage[0]) formData.append("cover_image", values.coverImage[0]);
  values.galleryImages.forEach((file) => formData.append("gallery_images", file));

  return formData;
}

/** Prefills the (unchanged) wizard form from a fetched event, for editing. */
export function eventToFormValues(event: Event): EventFormValues {
  let date = "";
  let time = "";
  if (event.startAt) {
    const [datePart, timePart] = event.startAt.split("T");
    date = datePart ?? "";
    time = timePart ? timePart.slice(0, 5) : "";
  }

  let endDate = "";
  if (event.endAt) {
    endDate = event.endAt.split("T")[0] ?? "";
  }

  return {
    name: event.title,
    category: event.category,
    region: event.region,
    description: event.description,
    date,
    time,
    durationType: event.durationType || "single",
    endDate,
    guideId: event.guide,
    sweepGuideId: "",
    languageIds: event.languages,
    difficultyIds: event.difficulty ? [event.difficulty] : [],
    distanceKm: event.distanceKm,
    elevationGainM: event.elevationGainM,
    meetingPointDescription: event.meetingPointNote,
    meetingPointCoordinates:
      event.meetingPointLat && event.meetingPointLng
        ? `${event.meetingPointLat}, ${event.meetingPointLng}`
        : "",
    maxParticipants: event.maxParticipants,
    priceType: event.priceType,
    price: event.price,
    whatIsNecessary: event.requiredItems.join("\n"),
    includedItems: event.included,
    excludedItems: event.notIncluded,
    cancellationPolicy: event.cancellationTerms,
    additionalInfo: event.otherInfo,
    coverImage: [],
    galleryImages: [],
  };
}

export const MISSING_TO_PUBLISH_FIELDS = [
  "title",
  "category",
  "cover_image",
  "start_at",
  "region",
  "difficulty",
  "guide",
  "languages",
  "end_at",
  "price",
] as const;
