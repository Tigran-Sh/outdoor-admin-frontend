import type { Meta, StoryObj } from "@storybook/react-vite";

import LanguageSwitcher from "./LanguageSwitcher";

const meta = {
  title: "UI/LanguageSwitcher",
  component: LanguageSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OnDarkBackground: Story = {
  render: (args) => (
    <div className="p-4 bg-dark d-inline-block rounded">
      <LanguageSwitcher {...args} />
    </div>
  ),
};
