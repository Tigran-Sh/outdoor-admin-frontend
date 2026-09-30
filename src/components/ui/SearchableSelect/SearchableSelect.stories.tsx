import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import SearchableSelect from "./SearchableSelect";

const GUIDE_OPTIONS = [
  { value: "ani", label: "Ani Grigoryan" },
  { value: "david", label: "David Sargsyan" },
  { value: "mari", label: "Mari Petrosyan" },
  { value: "narek", label: "Narek Hakobyan" },
];

const meta = {
  title: "UI/SearchableSelect",
  component: SearchableSelect,
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
    label: "Assigned Guide",
    options: GUIDE_OPTIONS,
    placeholder: "Select a guide",
    value: "",
    onChange: () => {},
  },
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState(args.value);
      return (
        <SearchableSelect
          {...args}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }
    return <Controlled />;
  },
} satisfies Meta<typeof SearchableSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithValue: Story = {
  args: {
    value: "david",
  },
};

export const NotClearable: Story = {
  args: {
    value: "mari",
    isClearable: false,
  },
};

export const WithError: Story = {
  args: {
    error: "Please select a guide",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "Optional. The guide who stays at the back of the group.",
  },
};

export const Disabled: Story = {
  args: {
    value: "ani",
    disabled: true,
  },
};
