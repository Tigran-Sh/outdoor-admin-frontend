import type { SidebarNavSection } from "@/components/ui/SidebarNav/SidebarNav.types";

export const clubOwnerMenu: SidebarNavSection[] = [
  {
    key: "main",
    titleKey: "sidebar.groups.main",
    items: [
      {
        key: "dashboard",
        labelKey: "sidebar.dashboard",
        path: "/club/dashboard",
        icon: "ri-dashboard-3-line",
        end: true,
      },
      {
        key: "events",
        labelKey: "sidebar.events",
        path: "/club/events",
        icon: "ri-calendar-check-line",
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
        key: "team",
        labelKey: "sidebar.team",
        path: "/club/team",
        icon: "ri-team-line",
      },
      {
        key: "finance-payouts",
        labelKey: "sidebar.financePayouts",
        icon: "ri-wallet-3-line",
      },
      {
        key: "refund-requests",
        labelKey: "sidebar.refundRequests",
        icon: "ri-refund-2-line",
      },
      {
        key: "reviews",
        labelKey: "sidebar.reviews",
        icon: "ri-star-line",
      },
      {
        key: "club-profile",
        labelKey: "sidebar.clubProfile",
        path: "/club/profile",
        icon: "ri-building-line",
      },
      {
        key: "settings",
        labelKey: "sidebar.settings",
        icon: "ri-settings-3-line",
      },
    ],
  },
];
