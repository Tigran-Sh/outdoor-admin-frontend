import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";
import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import { REGIONS, type RegionCode } from "@/constants/regions";

export { ACTIVITY_TYPES };
export const CLUB_REGIONS = REGIONS;
export type ClubRegion = RegionCode;

export const ENTITY_TYPES = ["individual", "soleTrader", "llc", "informal"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export type ClubVerificationStatus = "pending" | "identityVerified" | "fullyVerified";

export function getClubVerificationStatus(
  club: Pick<ClubListItem, "identityVerified" | "paymentVerified">,
): ClubVerificationStatus {
  if (club.identityVerified && club.paymentVerified) return "fullyVerified";
  if (club.identityVerified) return "identityVerified";
  return "pending";
}

export const CLUB_STATUS_BADGE_VARIANT: Record<ClubVerificationStatus, BadgeVariant> = {
  pending: "warning",
  identityVerified: "info",
  fullyVerified: "success",
};

export interface ClubListItem {
  id: string;
  name: string;
  logo: File[];
  coverImage: File[];
  about: string;
  activityTypeIds: string[];
  baseRegion: ClubRegion;
  yearFounded: string;
  email: string;
  phone: string;
  instagram: string;
  facebook: string;
  telegram: string;
  website: string;
  entityType: EntityType;
  taxId: string;
  ownerIdDocument: File[];
  identityVerified: boolean;
  paymentVerified: boolean;
}

export const mockClubs: ClubListItem[] = [
  {
    id: "1",
    name: "Dilijan Hikers",
    logo: [],
    coverImage: [],
    about:
      "A Tavush-based hiking club running guided treks through Dilijan National Park and the surrounding forests every weekend.",
    activityTypeIds: ["hiking", "trailRunning"],
    baseRegion: "tavush",
    yearFounded: "2018",
    email: "hello@dilijanhikers.am",
    phone: "+374 91 234 567",
    instagram: "dilijanhikers",
    facebook: "dilijanhikers",
    telegram: "",
    website: "https://dilijanhikers.am",
    entityType: "llc",
    taxId: "02547896",
    ownerIdDocument: [],
    identityVerified: true,
    paymentVerified: true,
  },
  {
    id: "2",
    name: "Sevan Watersports",
    logo: [],
    coverImage: [],
    about:
      "Kayaking, rafting, and SUP tours on Lake Sevan. Equipment and certified instructors included on every trip.",
    activityTypeIds: ["kayaking", "rafting", "supBoarding"],
    baseRegion: "gegharkunik",
    yearFounded: "2021",
    email: "info@sevanwater.am",
    phone: "+374 93 456 789",
    instagram: "sevanwatersports",
    facebook: "",
    telegram: "sevanwatersports",
    website: "",
    entityType: "soleTrader",
    taxId: "01983475",
    ownerIdDocument: [],
    identityVerified: true,
    paymentVerified: false,
  },
  {
    id: "3",
    name: "Yerevan Freeride",
    logo: [],
    coverImage: [],
    about:
      "A small collective of climbers and skiers organizing weekend trips around Yerevan and the Aragats range.",
    activityTypeIds: ["climbing", "skiing", "snowboarding"],
    baseRegion: "yerevan",
    yearFounded: "",
    email: "team@yerevanfreeride.am",
    phone: "+374 95 111 222",
    instagram: "yerevanfreeride",
    facebook: "yerevanfreeride",
    telegram: "",
    website: "",
    entityType: "individual",
    taxId: "",
    ownerIdDocument: [],
    identityVerified: false,
    paymentVerified: false,
  },
  {
    id: "4",
    name: "Aragats Air Sports",
    logo: [],
    coverImage: [],
    about:
      "Paragliding and hang gliding club flying off the slopes of Mount Aragats, open to beginners and licensed pilots alike.",
    activityTypeIds: ["paragliding", "hangGliding", "skydiving"],
    baseRegion: "aragatsotn",
    yearFounded: "2015",
    email: "fly@aragatsair.am",
    phone: "+374 77 888 999",
    instagram: "",
    facebook: "aragatsairsports",
    telegram: "aragatsair",
    website: "https://aragatsair.am",
    entityType: "informal",
    taxId: "",
    ownerIdDocument: [],
    identityVerified: true,
    paymentVerified: false,
  },
];
