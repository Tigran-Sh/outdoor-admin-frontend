import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

import SidebarItem from "./SidebarItem";

const meta = {
  title: "UI/SidebarItem",
  component: SidebarItem,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ul className="navbar-nav" style={{ width: 250 }}>
          <Story />
        </ul>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof SidebarItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    item: {
      key: "dashboard",
      labelKey: "sidebar.dashboard",
      path: "/",
      icon: "ri-dashboard-3-line",
      end: true,
    },
  },
};

export const WithBadge: Story = {
  args: {
    item: {
      key: "finance",
      labelKey: "sidebar.finance",
      path: "/finance",
      icon: "ri-wallet-3-line",
      badge: { text: "3", variant: "danger" },
    },
  },
};

export const WithChildren: Story = {
  args: {
    item: {
      key: "events",
      labelKey: "sidebar.events",
      icon: "ri-calendar-check-line",
      items: [
        { key: "events-upcoming", labelKey: "sidebar.eventsUpcoming", path: "/events/upcoming" },
        { key: "events-past", labelKey: "sidebar.eventsPast", path: "/events/past" },
      ],
    },
  },
};
