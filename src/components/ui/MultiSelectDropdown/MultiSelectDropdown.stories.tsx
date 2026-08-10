import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import MultiSelectDropdown from "./MultiSelectDropdown";
import type { MultiSelectDropdownOption } from "./MultiSelectDropdown.types";

const options: MultiSelectDropdownOption[] = [
  { value: "trail-run", label: "Sunrise Trail Run — Jun 12" },
  { value: "peak-hike", label: "Peak Hike — Jun 20" },
  { value: "river-kayak", label: "River Kayak Tour — Jul 2" },
  { value: "night-climb", label: "Night Climb — Jul 15" },
];

const meta = {
  title: "UI/MultiSelectDropdown",
  component: MultiSelectDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Assigned Events",
    options,
    value: [],
    onChange: () => {},
    placeholder: "Select events",
  },
} satisfies Meta<typeof MultiSelectDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState<string[]>(args.value);
      return <MultiSelectDropdown {...args} value={value} onChange={setValue} />;
    }
    return <Controlled />;
  },
};

export const WithSelection: Story = {
  args: {
    value: ["trail-run", "river-kayak"],
  },
};

export const WithError: Story = {
  args: {
    error: "Please select at least one event",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: ["trail-run"],
  },
};
