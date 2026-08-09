import type { Meta, StoryObj } from "@storybook/react-vite";

import ThemeSwitcher from "./ThemeSwitcher";

const meta = {
  title: "UI/ThemeSwitcher",
  component: ThemeSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
