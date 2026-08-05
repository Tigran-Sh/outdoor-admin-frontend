import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";

export interface EventCategoryOption {
  id: string;
  variant: BadgeVariant;
}

export const EVENT_CATEGORIES: EventCategoryOption[] = [
  { id: "hiking", variant: "success" },
  { id: "cycling", variant: "info" },
  { id: "water", variant: "primary" },
  { id: "adventure", variant: "danger" },
  { id: "sunrise", variant: "warning" },
];

export interface EventGuideOption {
  id: string;
  name: string;
}

export const EVENT_GUIDES: EventGuideOption[] = [
  { id: "ani", name: "Ani Grigoryan" },
  { id: "david", name: "David Sargsyan" },
  { id: "mari", name: "Mari Petrosyan" },
];

export type EventStatus = "scheduled" | "cancelled";

export interface EventListItem {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  guideId: string;
  categoryIds: string[];
  description: string;
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
    location: "Dilijan National Park",
    date: "2026-08-12",
    time: "06:00",
    guideId: "ani",
    categoryIds: ["hiking", "sunrise"],
    description: "An early morning hike to catch the sunrise over the Dilijan ridge.",
    status: "scheduled",
  },
  {
    id: "2",
    name: "Lake Sevan Cycling Tour",
    location: "Lake Sevan",
    date: "2026-08-20",
    time: "09:00",
    guideId: "david",
    categoryIds: ["cycling"],
    description: "A relaxed cycling tour along the shore of Lake Sevan.",
    status: "scheduled",
  },
  {
    id: "3",
    name: "Debed Canyon Rafting",
    location: "Debed River",
    date: "2026-09-02",
    time: "10:30",
    guideId: "mari",
    categoryIds: ["water", "adventure"],
    description: "White-water rafting through the Debed Canyon.",
    status: "scheduled",
  },
];
