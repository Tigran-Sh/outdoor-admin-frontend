import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";
import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import { EVENT_LANGUAGES, mockEvents } from "@/pages/events/EventsPage.data";

import type { TeamMemberFormValues } from "./TeamMember.schema";

export { ACTIVITY_TYPES };
export const TEAM_LANGUAGES = EVENT_LANGUAGES;
export const TEAM_EVENTS = mockEvents;

export interface TeamRoleOption {
  id: string;
  variant: BadgeVariant;
}

export const TEAM_ROLES: TeamRoleOption[] = [
  { id: "leadGuide", variant: "primary" },
  { id: "sweepGuide", variant: "info" },
  { id: "manager", variant: "warning" },
  { id: "adminAssistant", variant: "secondary" },
];
export type TeamRoleId = (typeof TEAM_ROLES)[number]["id"];

export const TEAM_PERMISSIONS = [
  "qrCheckIn",
  "participantsView",
  "gpsTracking",
  "emergencyButton",
  "eventManage",
  "financeView",
] as const;
export type TeamPermission = (typeof TEAM_PERMISSIONS)[number];

export interface TeamMemberListItem {
  id: string;
  firstName: string;
  lastName: string;
  photo: File[];
  phone: string;
  email: string;
  birthDate: string;
  role: string;
  permissionIds: string[];
  activityTypeIds: string[];
  languageIds: string[];
  experienceYears: string;
  bio: string;
  certificates: File[];
  assignedEventIds: string[];
  isActive: boolean;
  joinedDate: string;
}

export function getTeamMemberFullName(member: Pick<TeamMemberListItem, "firstName" | "lastName">): string {
  return `${member.firstName} ${member.lastName}`.trim();
}

export function toTeamMemberFormValues(member: TeamMemberListItem): TeamMemberFormValues {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    photo: member.photo,
    phone: member.phone,
    email: member.email,
    birthDate: member.birthDate,
    role: member.role,
    permissionIds: member.permissionIds,
    activityTypeIds: member.activityTypeIds,
    languageIds: member.languageIds,
    experienceYears: member.experienceYears,
    bio: member.bio,
    certificates: member.certificates,
    assignedEventIds: member.assignedEventIds,
    isActive: member.isActive,
  };
}

export function toTeamMemberListItem(
  values: TeamMemberFormValues,
): Omit<TeamMemberListItem, "id" | "joinedDate"> {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    photo: values.photo,
    phone: values.phone,
    email: values.email,
    birthDate: values.birthDate,
    role: values.role,
    permissionIds: values.permissionIds,
    activityTypeIds: values.activityTypeIds,
    languageIds: values.languageIds,
    experienceYears: values.experienceYears,
    bio: values.bio,
    certificates: values.certificates,
    assignedEventIds: values.assignedEventIds,
    isActive: values.isActive,
  };
}

export function getTeamMemberById(id: string): TeamMemberListItem | undefined {
  return mockTeamMembers.find((member) => member.id === id);
}

export const mockTeamMembers: TeamMemberListItem[] = [
  {
    id: "ani",
    firstName: "Ani",
    lastName: "Grigoryan",
    photo: [],
    phone: "+374 91 111 222",
    email: "ani.grigoryan@dilijanhikers.am",
    birthDate: "1994-05-02",
    role: "leadGuide",
    permissionIds: ["qrCheckIn", "participantsView", "gpsTracking", "emergencyButton", "eventManage"],
    activityTypeIds: ["hiking", "climbing", "trailRunning"],
    languageIds: ["en", "hy"],
    experienceYears: "6",
    bio: "Lead hiking and climbing guide specializing in multi-day mountain routes across Tavush and Aragatsotn.",
    certificates: [],
    assignedEventIds: ["1", "4", "7"],
    isActive: true,
    joinedDate: "2022-03-14",
  },
  {
    id: "david",
    firstName: "David",
    lastName: "Sargsyan",
    photo: [],
    phone: "+374 91 222 333",
    email: "david.sargsyan@dilijanhikers.am",
    birthDate: "1991-11-19",
    role: "leadGuide",
    permissionIds: ["qrCheckIn", "participantsView", "gpsTracking", "emergencyButton"],
    activityTypeIds: ["cycling", "zipline", "wakeboarding", "kayaking"],
    languageIds: ["en", "ru"],
    experienceYears: "4",
    bio: "Water sports and cycling specialist, running the club's zipline and wakeboarding sessions.",
    certificates: [],
    assignedEventIds: ["2", "4", "5", "8", "9"],
    isActive: true,
    joinedDate: "2023-01-10",
  },
  {
    id: "mari",
    firstName: "Mari",
    lastName: "Petrosyan",
    photo: [],
    phone: "+374 91 333 444",
    email: "mari.petrosyan@dilijanhikers.am",
    birthDate: "1996-02-27",
    role: "sweepGuide",
    permissionIds: ["qrCheckIn", "participantsView", "emergencyButton"],
    activityTypeIds: ["rafting", "paragliding", "kayaking"],
    languageIds: ["hy", "ru"],
    experienceYears: "5",
    bio: "Certified rafting and paragliding sweep guide, always the last one off the trail or river.",
    certificates: [],
    assignedEventIds: ["2", "3", "6", "7", "10"],
    isActive: true,
    joinedDate: "2021-11-05",
  },
  {
    id: "narek",
    firstName: "Narek",
    lastName: "Avetisyan",
    photo: [],
    phone: "+374 91 444 555",
    email: "narek.avetisyan@dilijanhikers.am",
    birthDate: "1988-07-08",
    role: "manager",
    permissionIds: ["participantsView", "eventManage", "financeView"],
    activityTypeIds: [],
    languageIds: ["hy", "en"],
    experienceYears: "8",
    bio: "Handles logistics, scheduling, and partner communications for the club.",
    certificates: [],
    assignedEventIds: [],
    isActive: true,
    joinedDate: "2020-06-01",
  },
  {
    id: "lilit",
    firstName: "Lilit",
    lastName: "Harutyunyan",
    photo: [],
    phone: "+374 91 555 666",
    email: "lilit.harutyunyan@dilijanhikers.am",
    birthDate: "1999-09-15",
    role: "adminAssistant",
    permissionIds: ["participantsView"],
    activityTypeIds: [],
    languageIds: ["hy"],
    experienceYears: "1",
    bio: "Front-office assistant helping with check-ins and participant communication.",
    certificates: [],
    assignedEventIds: [],
    isActive: false,
    joinedDate: "2024-02-20",
  },
];
