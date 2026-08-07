import type { Meta, StoryObj } from "@storybook/react-vite";

import Avatar from "./Avatar";
import type { AvatarSize } from "./Avatar.types";

const sizes: AvatarSize[] = ["xxs", "xs", "sm", "md", "lg", "xl"];

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    size: {
      control: "select",
      options: sizes,
    },
  },
  args: {
    name: "Dilijan Hikers",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllSizes: Story = {
  render: (args) => (
    <div className="d-flex align-items-end gap-3">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    src: "https://picsum.photos/200",
    size: "lg",
  },
};

export const Square: Story = {
  args: {
    rounded: false,
    size: "lg",
  },
};
