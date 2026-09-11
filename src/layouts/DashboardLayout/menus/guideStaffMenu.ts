import type { SidebarNavSection } from "@/components/ui/SidebarNav/SidebarNav.types";

export const guideStaffMenu: SidebarNavSection[] = [
  {
    key: "main",
    titleKey: "sidebar.groups.main",
    items: [
      {
        key: "my-events",
        labelKey: "sidebar.myEvents",
        path: "/club/dashboard",
        icon: "ri-calendar-check-line",
        end: true,
      },
      {
        key: "calendar",
        labelKey: "sidebar.calendar",
        path: "/club/calendar",
        icon: "ri-calendar-2-line",
      },
      {
        key: "participants",
        labelKey: "sidebar.participants",
        icon: "ri-group-line",
      },
      {
        key: "check-in",
        labelKey: "sidebar.checkIn",
        icon: "ri-qr-scan-2-line",
      },
      {
        key: "confirm-completion",
        labelKey: "sidebar.confirmCompletion",
        icon: "ri-checkbox-circle-line",
      },
      {
        key: "my-profile",
        labelKey: "sidebar.myProfile",
        icon: "ri-user-line",
      },
    ],
  },
];
