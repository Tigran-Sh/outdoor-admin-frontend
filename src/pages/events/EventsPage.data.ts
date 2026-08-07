import { ACTIVITY_TYPES, type ActivityTypeOption } from "@/constants/activityTypes";
import { REGIONS, type RegionCode } from "@/constants/regions";

export const EVENT_CATEGORIES: ActivityTypeOption[] = ACTIVITY_TYPES;

export interface EventGuideOption {
  id: string;
  name: string;
}

export const EVENT_GUIDES: EventGuideOption[] = [
  { id: "ani", name: "Ani Grigoryan" },
  { id: "david", name: "David Sargsyan" },
  { id: "mari", name: "Mari Petrosyan" },
];

export const EVENT_LANGUAGES = ["en", "hy", "ru"] as const;
export type EventLanguage = (typeof EVENT_LANGUAGES)[number];

export const EVENT_REGIONS = REGIONS;
export type EventRegion = RegionCode;

export const EVENT_DIFFICULTIES = ["easy", "medium", "hard", "extreme"] as const;
export type EventDifficulty = (typeof EVENT_DIFFICULTIES)[number];

export const EVENT_PRICE_TYPES = ["free", "paid"] as const;
export type EventPriceType = (typeof EVENT_PRICE_TYPES)[number];

export const EVENT_DURATION_TYPES = ["single", "multi"] as const;
export type EventDurationType = (typeof EVENT_DURATION_TYPES)[number];

export type EventStatus = "scheduled" | "cancelled";

export interface EventListItem {
  id: string;
  name: string;
  category: string;
  region: EventRegion;
  date: string;
  time: string;
  durationType: EventDurationType;
  endDate: string;
  guideId: string;
  sweepGuideId: string;
  languageIds: EventLanguage[];
  difficultyIds: EventDifficulty[];
  distanceKm: string;
  elevationGainM: string;
  meetingPointDescription: string;
  meetingPointCoordinates: string;
  maxParticipants: string;
  priceType: EventPriceType;
  price: string;
  whatIsNecessary: string;
  includedItems: string;
  excludedItems: string;
  cancellationPolicy: string;
  additionalInfo: string;
  description: string;
  coverImage: File[];
  galleryImages: File[];
  status: EventStatus;
}

export function formatEventDate(date: string, time: string): string {
  const parsed = new Date(`${date}T${time}`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export const mockEvents: EventListItem[] = [
  {
    id: "1",
    name: "Sunrise Ridge Hike",
    category: "hiking",
    region: "tavush",
    date: "2026-08-12",
    time: "06:00",
    durationType: "single",
    endDate: "",
    guideId: "ani",
    sweepGuideId: "",
    languageIds: ["en", "hy"],
    difficultyIds: ["medium"],
    distanceKm: "8",
    elevationGainM: "420",
    meetingPointDescription: "Main parking lot at the Dilijan National Park visitor center.",
    meetingPointCoordinates: "40.7397, 44.8639",
    maxParticipants: "18",
    priceType: "paid",
    price: "8000",
    whatIsNecessary: "Hiking boots, water, and a headlamp for the pre-dawn start.",
    includedItems: "Professional guide, breakfast, and transport from Yerevan.",
    excludedItems: "Personal hiking gear and travel insurance.",
    cancellationPolicy: "Full refund up to 48 hours before the event.",
    additionalInfo: "Bring warm layers, sunrise temperatures can be low.",
    description: "An early morning hike to catch the sunrise over the Dilijan ridge.",
    coverImage: [],
    galleryImages: [],
    status: "scheduled",
  },
  {
    id: "2",
    name: "Lake Sevan Cycling Tour",
    category: "cycling",
    region: "gegharkunik",
    date: "2026-08-20",
    time: "09:00",
    durationType: "single",
    endDate: "",
    guideId: "david",
    sweepGuideId: "mari",
    languageIds: ["en", "ru"],
    difficultyIds: ["easy"],
    distanceKm: "22",
    elevationGainM: "150",
    meetingPointDescription: "Sevan boat station, next to the lakeside promenade.",
    meetingPointCoordinates: "40.5536, 45.0122",
    maxParticipants: "25",
    priceType: "free",
    price: "",
    whatIsNecessary: "Comfortable clothing and a water bottle.",
    includedItems: "Bike rental and a support vehicle.",
    excludedItems: "Food and drinks.",
    cancellationPolicy: "Free cancellation any time before the event starts.",
    additionalInfo: "",
    description: "A relaxed cycling tour along the shore of Lake Sevan.",
    coverImage: [],
    galleryImages: [],
    status: "scheduled",
  },
  {
    id: "3",
    name: "Debed Canyon Rafting",
    category: "rafting",
    region: "lori",
    date: "2026-09-02",
    time: "10:30",
    durationType: "multi",
    endDate: "2026-09-03",
    guideId: "mari",
    sweepGuideId: "",
    languageIds: ["hy", "ru"],
    difficultyIds: ["hard", "extreme"],
    distanceKm: "12",
    elevationGainM: "60",
    meetingPointDescription: "Rafting base camp entrance, riverside gate.",
    meetingPointCoordinates: "41.0297, 44.6975",
    maxParticipants: "12",
    priceType: "paid",
    price: "15000",
    whatIsNecessary: "Swimwear, a change of clothes, and a valid ID.",
    includedItems: "Rafting equipment, safety briefing, and certified instructor.",
    excludedItems: "Wetsuit rental (available on-site for an extra fee).",
    cancellationPolicy: "50% refund up to 72 hours before the event.",
    additionalInfo: "Minimum age 16. Swimming ability required.",
    description: "White-water rafting through the Debed Canyon.",
    coverImage: [],
    galleryImages: [],
    status: "scheduled",
  },
];
