import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Radio from "./Radio";

const meta = {
  title: "UI/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    name: "story-radio",
    label: "Option A",
    disabled: false,
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const Group: Story = {
  render: () => {
    function RadioGroup() {
      const [value, setValue] = useState("a");
      return (
        <>
          <Radio
            name="group-story"
            label="Option A"
            checked={value === "a"}
            onChange={() => setValue("a")}
          />
          <Radio
            name="group-story"
            label="Option B"
            checked={value === "b"}
            onChange={() => setValue("b")}
          />
          <Radio
            name="group-story"
            label="Option C"
            checked={value === "c"}
            onChange={() => setValue("c")}
          />
        </>
      );
    }
    return <RadioGroup />;
  },
};
