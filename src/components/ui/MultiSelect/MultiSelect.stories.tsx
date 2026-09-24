import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import MultiSelect from "./MultiSelect";
import type { MultiSelectOption } from "./MultiSelect.types";

const options: MultiSelectOption[] = [
  { value: "en", label: "English" },
  { value: "hy", label: "Armenian" },
  { value: "ru", label: "Russian" },
];

const meta = {
  title: "UI/MultiSelect",
  component: MultiSelect,
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
    label: "Guide working languages",
    options,
    value: [],
    onChange: () => {},
    placeholder: "Select languages",
  },
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState<string[]>(args.value);
      return <MultiSelect {...args} value={value} onChange={setValue} />;
    }
    return <Controlled />;
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithSelection: Story = {
  args: {
    value: ["en", "hy"],
  },
};

export const WithError: Story = {
  args: {
    error: "Please select at least one language",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "Participants can filter events by these.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: ["en"],
  },
};
