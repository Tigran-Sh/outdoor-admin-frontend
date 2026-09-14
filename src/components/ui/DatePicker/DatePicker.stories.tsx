import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import DatePicker from "./DatePicker";

const meta = {
  title: "UI/DatePicker",
  component: DatePicker,
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
    label: "Event date",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");
    return (
      <DatePicker
        {...args}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithError: Story = {
  args: {
    error: "Please pick a date",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "You can change this later.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
