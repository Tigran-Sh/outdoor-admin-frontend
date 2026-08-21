import type { Meta, StoryObj } from "@storybook/react-vite";

import RowActionsMenu from "./RowActionsMenu";

const meta = {
  title: "UI/RowActionsMenu",
  component: RowActionsMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    ariaLabel: "Row actions",
    actions: [
      { key: "edit", label: "Edit", icon: "ri-pencil-fill", onClick: () => {} },
      { key: "role", label: "Change role", icon: "ri-shield-user-line", onClick: () => {} },
      {
        key: "deactivate",
        label: "Deactivate",
        icon: "ri-forbid-line",
        variant: "danger",
        onClick: () => {},
      },
    ],
  },
} satisfies Meta<typeof RowActionsMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHiddenAction: Story = {
  args: {
    actions: [
      { key: "edit", label: "Edit", icon: "ri-pencil-fill", onClick: () => {} },
      {
        key: "capabilities",
        label: "Manage capabilities",
        icon: "ri-settings-4-line",
        onClick: () => {},
        hidden: true,
      },
      {
        key: "deactivate",
        label: "Deactivate",
        icon: "ri-forbid-line",
        variant: "danger",
        onClick: () => {},
      },
    ],
  },
};
