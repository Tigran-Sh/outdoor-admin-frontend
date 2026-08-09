export const REGIONS = [
  "yerevan",
  "aragatsotn",
  "ararat",
  "armavir",
  "gegharkunik",
  "kotayk",
  "lori",
  "shirak",
  "syunik",
  "tavush",
  "vayotsDzor",
] as const;

export type RegionCode = (typeof REGIONS)[number];
