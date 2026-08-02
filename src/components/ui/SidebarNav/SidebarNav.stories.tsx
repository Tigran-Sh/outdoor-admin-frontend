import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

import SidebarNav from "./SidebarNav";
import type { SidebarNavSection } from "./SidebarNav.types";

const sections: SidebarNavSection[] = [
  {
    key: "main",
    titleKey: "sidebar.groups.main",
    items: [
      { key: "dashboard", labelKey: "sidebar.dashboard", path: "/", icon: "ri-dashboard-3-line", end: true },
      {
        key: "events",
        labelKey: "sidebar.events",
        icon: "ri-calendar-check-line",
        items: [
          { key: "events-upcoming", labelKey: "sidebar.eventsUpcoming", path: "/events/upcoming" },
          { key: "events-past", labelKey: "sidebar.eventsPast", path: "/events/past" },
        ],
      },
      {
        key: "finance",
        labelKey: "sidebar.finance",
        path: "/finance",
        icon: "ri-wallet-3-line",
        badge: { text: "3", variant: "danger" },
      },
    ],
  },
];

const meta = {
  title: "UI/SidebarNav",
  component: SidebarNav,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="app-menu navbar-menu" style={{ position: "static", width: 250 }}>
          <div className="container-fluid">
            <Story />
          </div>
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof SidebarNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    sections,
  },
};
