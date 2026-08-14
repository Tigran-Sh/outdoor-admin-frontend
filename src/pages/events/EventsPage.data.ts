import { ACTIVITY_TYPES, type ActivityTypeOption } from "@/constants/activityTypes";
import { REGIONS, type RegionCode } from "@/constants/regions";

import type { EventFormValues } from "./EventForm.schema";

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
  /** Number of tickets/spots booked so far. Used for dashboard statistics. */
  soldCount: number;
  /** Reason provided when the event was cancelled. */
  cancellationReason?: string;
}

export const EVENT_CANCELLATION_REASONS = [
  "lowRegistrations",
  "weatherConditions",
  "guideUnavailable",
  "safetyConcerns",
  "other",
] as const;

export type EventCancellationReason = (typeof EVENT_CANCELLATION_REASONS)[number];

export function formatEventDate(date: string, time: string): string {
  const parsed = new Date(`${date}T${time}`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function toEventFormValues(event: EventListItem): EventFormValues {
  return {
    name: event.name,
    category: event.category,
    region: event.region,
    description: event.description,
    date: event.date,
    time: event.time,
    durationType: event.durationType,
    endDate: event.endDate,
    guideId: event.guideId,
    sweepGuideId: event.sweepGuideId,
    languageIds: event.languageIds,
    difficultyIds: event.difficultyIds,
    distanceKm: event.distanceKm,
    elevationGainM: event.elevationGainM,
    meetingPointDescription: event.meetingPointDescription,
    meetingPointCoordinates: event.meetingPointCoordinates,
    maxParticipants: event.maxParticipants,
    priceType: event.priceType,
    price: event.price,
    whatIsNecessary: event.whatIsNecessary,
    includedItems: event.includedItems,
    excludedItems: event.excludedItems,
    cancellationPolicy: event.cancellationPolicy,
    additionalInfo: event.additionalInfo,
    coverImage: event.coverImage,
    galleryImages: event.galleryImages,
  };
}

export function toEventListItem(
  values: EventFormValues,
): Omit<EventListItem, "id" | "status" | "soldCount"> {
  return {
    name: values.name,
    category: values.category,
    region: (EVENT_REGIONS as readonly string[]).includes(values.region)
      ? (values.region as EventRegion)
      : EVENT_REGIONS[0],
    date: values.date,
    time: values.time,
    durationType: (EVENT_DURATION_TYPES as readonly string[]).includes(values.durationType)
      ? (values.durationType as EventDurationType)
      : EVENT_DURATION_TYPES[0],
    endDate: values.endDate,
    guideId: values.guideId,
    sweepGuideId: values.sweepGuideId,
    languageIds: values.languageIds as EventLanguage[],
    difficultyIds: values.difficultyIds as EventDifficulty[],
    distanceKm: values.distanceKm,
    elevationGainM: values.elevationGainM,
    meetingPointDescription: values.meetingPointDescription,
    meetingPointCoordinates: values.meetingPointCoordinates,
    maxParticipants: values.maxParticipants,
    priceType: (EVENT_PRICE_TYPES as readonly string[]).includes(values.priceType)
      ? (values.priceType as EventPriceType)
      : EVENT_PRICE_TYPES[0],
    price: values.price,
    whatIsNecessary: values.whatIsNecessary,
    includedItems: values.includedItems,
    excludedItems: values.excludedItems,
    cancellationPolicy: values.cancellationPolicy,
    additionalInfo: values.additionalInfo,
    description: values.description,
    coverImage: values.coverImage,
    galleryImages: values.galleryImages,
  };
}

export function getEventById(id: string): EventListItem | undefined {
  return mockEvents.find((event) => event.id === id);
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
    soldCount: 15,
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
    soldCount: 22,
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
    soldCount: 9,
  },
  {
    id: "4",
    name: "Aragats Peak Climb",
    category: "climbing",
    region: "aragatsotn",
    date: "2026-07-18",
    time: "05:30",
    durationType: "single",
    endDate: "",
    guideId: "ani",
    sweepGuideId: "david",
    languageIds: ["en", "hy"],
    difficultyIds: ["hard"],
    distanceKm: "14",
    elevationGainM: "1200",
    meetingPointDescription: "Kari Lake base camp parking area.",
    meetingPointCoordinates: "40.5378, 44.1944",
    maxParticipants: "10",
    priceType: "paid",
    price: "12000",
    whatIsNecessary: "Climbing harness, helmet, sturdy boots, and 2L of water.",
    includedItems: "Certified climbing guide, safety equipment, and transport from Yerevan.",
    excludedItems: "Personal clothing and travel insurance.",
    cancellationPolicy: "Full refund up to 72 hours before the event.",
    additionalInfo: "Moderate fitness level required. Weather-dependent.",
    description: "A challenging climb to the southern peak of Mount Aragats.",
    coverImage: [],
    galleryImages: [],
    status: "scheduled",
    soldCount: 10,
  },
  {
    id: "5",
    name: "Ararat Valley Zipline Adventure",
    category: "zipline",
    region: "ararat",
    date: "2026-06-05",
    time: "11:00",
    durationType: "single",
    endDate: "",
    guideId: "david",
    sweepGuideId: "",
    languageIds: ["en", "ru"],
    difficultyIds: ["easy"],
    distanceKm: "2",
    elevationGainM: "80",
    meetingPointDescription: "Zipline park entrance, next to the visitor kiosk.",
    meetingPointCoordinates: "39.8339, 44.7028",
    maxParticipants: "30",
    priceType: "free",
    price: "",
    whatIsNecessary: "Closed-toe shoes and comfortable clothing.",
    includedItems: "Safety gear and a short briefing session.",
    excludedItems: "Photos and video recordings (available for purchase on-site).",
    cancellationPolicy: "Free cancellation any time before the event starts.",
    additionalInfo: "Suitable for families. Minimum age 8.",
    description: "A fun, family-friendly zipline circuit overlooking the Ararat valley.",
    coverImage: [],
    galleryImages: [],
    status: "scheduled",
    soldCount: 27,
  },
  {
    id: "6",
    name: "Tatev Paragliding Experience",
    category: "paragliding",
    region: "syunik",
    date: "2026-08-29",
    time: "08:00",
    durationType: "single",
    endDate: "",
    guideId: "mari",
    sweepGuideId: "",
    languageIds: ["hy", "ru"],
    difficultyIds: ["medium"],
    distanceKm: "5",
    elevationGainM: "600",
    meetingPointDescription: "Tatev Wings of Tatev upper station.",
    meetingPointCoordinates: "39.3789, 46.2503",
    maxParticipants: "8",
    priceType: "paid",
    price: "20000",
    whatIsNecessary: "Warm layers and closed-toe shoes.",
    includedItems: "Licensed tandem pilot, full safety equipment, and a certificate flight.",
    excludedItems: "Transport to Tatev and personal insurance.",
    cancellationPolicy: "50% refund up to 48 hours before the event.",
    additionalInfo: "Weight limit 100kg. Flights depend on wind conditions.",
    description: "Tandem paragliding over the Vorotan Gorge near the Tatev monastery.",
    coverImage: [],
    galleryImages: [],
    status: "scheduled",
    soldCount: 6,
  },
  {
    id: "7",
    name: "Yerevan Night Trail Run",
    category: "trailRunning",
    region: "yerevan",
    date: "2026-05-14",
    time: "20:00",
    durationType: "single",
    endDate: "",
    guideId: "ani",
    sweepGuideId: "mari",
    languageIds: ["en", "hy", "ru"],
    difficultyIds: ["medium"],
    distanceKm: "10",
    elevationGainM: "150",
    meetingPointDescription: "Yerevan Cascade Complex, main staircase.",
    meetingPointCoordinates: "40.1911, 44.5136",
    maxParticipants: "40",
    priceType: "free",
    price: "",
    whatIsNecessary: "Trail shoes, headlamp, and reflective clothing.",
    includedItems: "Route marking and a pacer guide.",
    excludedItems: "Timing chip and finisher medal.",
    cancellationPolicy: "Free cancellation any time before the event starts.",
    additionalInfo: "Cancelled due to low registration numbers. Will be rescheduled.",
    description: "An urban night trail run through Yerevan's parks and staircases.",
    coverImage: [],
    galleryImages: [],
    status: "cancelled",
    soldCount: 12,
    cancellationReason: "lowRegistrations",
  },
  {
    id: "8",
    name: "Aragatsotn Winter Ski Camp",
    category: "skiing",
    region: "aragatsotn",
    date: "2026-01-16",
    time: "09:00",
    durationType: "multi",
    endDate: "2026-01-18",
    guideId: "david",
    sweepGuideId: "ani",
    languageIds: ["en"],
    difficultyIds: ["hard", "extreme"],
    distanceKm: "5",
    elevationGainM: "500",
    meetingPointDescription: "Tsaghkadzor ski resort, lower cable car station.",
    meetingPointCoordinates: "40.5306, 44.7167",
    maxParticipants: "15",
    priceType: "paid",
    price: "45000",
    whatIsNecessary: "Ski gear, goggles, and thermal clothing (rentals available on request).",
    includedItems: "3 nights' accommodation, lift passes, and a certified instructor.",
    excludedItems: "Meals and equipment rental.",
    cancellationPolicy: "50% refund up to 7 days before the event.",
    additionalInfo: "Intermediate to advanced skiing ability required.",
    description: "A three-day ski camp for advanced skiers on the slopes of Tsaghkadzor.",
    coverImage: [],
    galleryImages: [],
    status: "scheduled",
    soldCount: 11,
  },
  {
    id: "9",
    name: "Dzoraget Wakeboard Session",
    category: "wakeboarding",
    region: "lori",
    date: "2026-07-05",
    time: "13:00",
    durationType: "single",
    endDate: "",
    guideId: "mari",
    sweepGuideId: "",
    languageIds: ["ru"],
    difficultyIds: ["easy"],
    distanceKm: "3",
    elevationGainM: "10",
    meetingPointDescription: "Dzoraget reservoir boat launch.",
    meetingPointCoordinates: "41.0333, 44.4833",
    maxParticipants: "6",
    priceType: "paid",
    price: "10000",
    whatIsNecessary: "Swimwear and a towel. Life jackets are provided.",
    includedItems: "Wakeboard, boat, life jacket, and instructor.",
    excludedItems: "Wetsuit rental.",
    cancellationPolicy: "Full refund up to 24 hours before the event.",
    additionalInfo: "Beginners welcome. Basic swimming ability required.",
    description: "A beginner-friendly wakeboarding session on the Dzoraget reservoir.",
    coverImage: [],
    galleryImages: [],
    status: "scheduled",
    soldCount: 5,
  },
  {
    id: "10",
    name: "Sevan Sunset Kayaking",
    category: "kayaking",
    region: "gegharkunik",
    date: "2026-06-21",
    time: "18:30",
    durationType: "single",
    endDate: "",
    guideId: "david",
    sweepGuideId: "",
    languageIds: ["en", "hy"],
    difficultyIds: ["easy"],
    distanceKm: "6",
    elevationGainM: "5",
    meetingPointDescription: "Sevanavank monastery beach access point.",
    meetingPointCoordinates: "40.6167, 44.9500",
    maxParticipants: "20",
    priceType: "free",
    price: "",
    whatIsNecessary: "Change of clothes and sun protection.",
    includedItems: "Kayak, paddle, and life jacket.",
    excludedItems: "Photography services.",
    cancellationPolicy: "Free cancellation any time before the event starts.",
    additionalInfo: "Cancelled due to unfavorable lake conditions.",
    description: "A relaxed sunset kayaking trip along the shore near Sevanavank.",
    coverImage: [],
    galleryImages: [],
    status: "cancelled",
    soldCount: 8,
    cancellationReason: "weatherConditions",
  },
];

export interface MonthlyTicketsSold {
  /** ISO month key, e.g. "2026-06". */
  month: string;
  /** Short display label, e.g. "Jun 26". */
  label: string;
  sold: number;
}

export function getMonthlyTicketsSold(events: EventListItem[]): MonthlyTicketsSold[] {
  const totals = new Map<string, number>();

  events.forEach((event) => {
    if (!event.date) return;
    const month = event.date.slice(0, 7);
    totals.set(month, (totals.get(month) ?? 0) + event.soldCount);
  });

  return Array.from(totals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, sold]) => ({
      month,
      label: new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      }),
      sold,
    }));
}

export interface EventTypeCount {
  category: string;
  count: number;
}

export function getEventCountByCategory(events: EventListItem[]): EventTypeCount[] {
  const totals = new Map<string, number>();

  events.forEach((event) => {
    totals.set(event.category, (totals.get(event.category) ?? 0) + 1);
  });

  return Array.from(totals.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTotalTicketsSold(events: EventListItem[]): number {
  return events.reduce((total, event) => total + event.soldCount, 0);
}

export function getTotalRevenue(events: EventListItem[]): number {
  return events.reduce((total, event) => {
    if (event.priceType !== "paid") return total;
    const price = Number(event.price) || 0;
    return total + price * event.soldCount;
  }, 0);
}

export function getUpcomingEventsCount(events: EventListItem[], from: Date = new Date()): number {
  return events.filter((event) => event.status === "scheduled" && new Date(event.date) >= from)
    .length;
}
