import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

import SidebarGroup from "./SidebarGroup";

const meta = {
  title: "UI/SidebarGroup",
  component: SidebarGroup,
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
} satisfies Meta<typeof SidebarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    titleKey: "sidebar.groups.main",
    children: (
      <li className="nav-item">
        <a className="nav-link menu-link" href="#!">
          <i className="ri-dashboard-3-line" />
          <span>Dashboard</span>
        </a>
      </li>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    children: (
      <li className="nav-item">
        <a className="nav-link menu-link" href="#!">
          <i className="ri-dashboard-3-line" />
          <span>Dashboard</span>
        </a>
      </li>
    ),
  },
};
