import type { Meta, StoryObj } from "@storybook/react-vite";

import Textarea from "./Textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Description",
    placeholder: "Describe the event...",
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithError: Story = {
  args: {
    error: "Please enter a description",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "Visible to participants when they book.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
