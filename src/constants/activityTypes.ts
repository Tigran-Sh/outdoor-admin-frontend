import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";

export interface ActivityTypeOption {
  id: string;
  variant: BadgeVariant;
}

export const ACTIVITY_TYPES: ActivityTypeOption[] = [
  { id: "hiking", variant: "success" },
  { id: "trailRunning", variant: "info" },
  { id: "cycling", variant: "primary" },
  { id: "climbing", variant: "danger" },
  { id: "zipline", variant: "warning" },
  { id: "skydiving", variant: "dark" },
  { id: "parachuting", variant: "secondary" },
  { id: "paragliding", variant: "info" },
  { id: "hangGliding", variant: "primary" },
  { id: "supBoarding", variant: "success" },
  { id: "yachting", variant: "dark" },
  { id: "surfing", variant: "info" },
  { id: "kayaking", variant: "primary" },
  { id: "rafting", variant: "danger" },
  { id: "canyoneering", variant: "warning" },
  { id: "wakeboarding", variant: "secondary" },
  { id: "skiing", variant: "success" },
  { id: "snowboarding", variant: "info" },
];

export type ActivityTypeId = (typeof ACTIVITY_TYPES)[number]["id"];
