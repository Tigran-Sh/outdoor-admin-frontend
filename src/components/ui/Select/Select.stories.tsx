import type { Meta, StoryObj } from "@storybook/react-vite";

import Select from "./Select";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    label: "Assigned guide",
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a guide</option>
      <option value="ani">Ani Grigoryan</option>
      <option value="david">David Sargsyan</option>
      <option value="mari">Mari Petrosyan</option>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithError: Story = {
  args: {
    error: "Please select a guide",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "You can reassign the guide later.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
