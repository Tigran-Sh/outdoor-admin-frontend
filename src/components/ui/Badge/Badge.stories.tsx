import type { Meta, StoryObj } from "@storybook/react-vite";

import Badge from "./Badge";
import type { BadgeAppearance, BadgeVariant } from "./Badge.types";

const variants: BadgeVariant[] = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "light",
  "dark",
];

const appearances: BadgeAppearance[] = ["solid", "subtle"];

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    appearance: {
      control: "select",
      options: appearances,
    },
  },
  args: {
    children: "Badge",
    variant: "primary",
    appearance: "solid",
    pill: false,
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: (args) => (
    <div className="d-flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const Subtle: Story = {
  args: {
    appearance: "subtle",
  },
  render: (args) => (
    <div className="d-flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const Pill: Story = {
  args: {
    pill: true,
  },
};
