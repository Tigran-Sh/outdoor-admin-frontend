import type { SidebarNavSection } from "@/components/ui/SidebarNav/SidebarNav.types";

export const platformAdminMenu: SidebarNavSection[] = [
  {
    key: "main",
    titleKey: "sidebar.groups.main",
    items: [
      {
        key: "club-verification",
        labelKey: "sidebar.clubVerification",
        icon: "ri-checkbox-circle-line",
      },
      {
        key: "clubs",
        labelKey: "sidebar.clubs",
        path: "/admin/clubs",
        icon: "ri-building-line",
      },
      {
        key: "users",
        labelKey: "sidebar.users",
        path: "/admin/users",
        icon: "ri-group-line",
      },
      {
        key: "roles",
        labelKey: "sidebar.roles",
        path: "/admin/roles",
        icon: "ri-shield-user-line",
      },
      {
        key: "events-moderation",
        labelKey: "sidebar.eventsModeration",
        icon: "ri-calendar-check-line",
      },
      {
        key: "finance-payouts",
        labelKey: "sidebar.financePayouts",
        icon: "ri-wallet-3-line",
      },
      {
        key: "reviews-disputes",
        labelKey: "sidebar.reviewsDisputes",
        icon: "ri-star-line",
      },
    ],
  },
];
