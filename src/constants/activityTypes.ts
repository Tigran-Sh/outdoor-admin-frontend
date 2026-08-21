import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";

export interface ActivityTypeOption {
  id: string;
  variant: BadgeVariant;
  icon: string;
}

export const ACTIVITY_TYPES: ActivityTypeOption[] = [
  { id: "hiking", variant: "success", icon: "ri-footprint-line" },
  { id: "trailRunning", variant: "info", icon: "ri-run-line" },
  { id: "cycling", variant: "primary", icon: "ri-bike-line" },
  { id: "climbing", variant: "danger", icon: "ri-landscape-line" },
  { id: "zipline", variant: "warning", icon: "ri-route-line" },
  { id: "skydiving", variant: "dark", icon: "ri-flight-takeoff-line" },
  { id: "parachuting", variant: "secondary", icon: "ri-flight-land-line" },
  { id: "paragliding", variant: "info", icon: "ri-windy-line" },
  { id: "hangGliding", variant: "primary", icon: "ri-windy-line" },
  { id: "supBoarding", variant: "success", icon: "ri-water-flash-line" },
  { id: "yachting", variant: "dark", icon: "ri-sailboat-line" },
  { id: "surfing", variant: "info", icon: "ri-water-flash-line" },
  { id: "kayaking", variant: "primary", icon: "ri-water-flash-line" },
  { id: "rafting", variant: "danger", icon: "ri-water-flash-line" },
  { id: "canyoneering", variant: "warning", icon: "ri-landscape-line" },
  { id: "wakeboarding", variant: "secondary", icon: "ri-water-flash-line" },
  { id: "skiing", variant: "success", icon: "ri-snowy-line" },
  { id: "snowboarding", variant: "info", icon: "ri-snowy-line" },
];

export type ActivityTypeId = (typeof ACTIVITY_TYPES)[number]["id"];
