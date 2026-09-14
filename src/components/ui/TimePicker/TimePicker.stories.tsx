import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import TimePicker from "./TimePicker";

const meta = {
  title: "UI/TimePicker",
  component: TimePicker,
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
    label: "Event time",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");
    return (
      <TimePicker
        {...args}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
} satisfies Meta<typeof TimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithError: Story = {
  args: {
    error: "Please pick a time",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "24-hour format.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
