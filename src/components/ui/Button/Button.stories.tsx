import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "./Button";
import type { ButtonAppearance, ButtonVariant } from "./Button.types";

const variants: ButtonVariant[] = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "light",
  "dark",
];

const appearances: ButtonAppearance[] = ["solid", "outline", "soft", "ghost"];

const meta = {
  title: "UI/Button",
  component: Button,
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
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    children: "Button",
    variant: "primary",
    appearance: "solid",
    size: "md",
    iconOnly: false,
    animated: false,
    loading: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: (args) => (
    <div className="d-flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const AllAppearances: Story = {
  render: (args) => (
    <div className="d-flex flex-column gap-3">
      {appearances.map((appearance) => (
        <div key={appearance} className="d-flex align-items-center gap-2">
          <span className="text-muted" style={{ width: 80 }}>
            {appearance}
          </span>
          {variants.map((variant) => (
            <Button key={variant} {...args} appearance={appearance} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="d-flex align-items-center gap-2">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    children: "+",
    "aria-label": "Add",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: "Saving...",
  },
};

export const Animated: Story = {
  args: {
    animated: true,
    children: "Hover me",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};
