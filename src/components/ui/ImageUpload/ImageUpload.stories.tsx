import { useState } from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ImageUpload from "./ImageUpload";

const meta = {
  title: "UI/ImageUpload",
  component: ImageUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Cover image",
    value: [],
    onChange: () => {},
  },
} satisfies Meta<typeof ImageUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractiveImageUpload(args: ComponentProps<typeof ImageUpload>) {
  const [files, setFiles] = useState<File[]>([]);

  return <ImageUpload {...args} value={files} onChange={setFiles} />;
}

export const Playground: Story = {
  render: (args) => <InteractiveImageUpload {...args} />,
};

export const Multiple: Story = {
  args: {
    label: "Gallery images",
    multiple: true,
    maxFiles: 6,
  },
  render: (args) => <InteractiveImageUpload {...args} />,
};

export const WithError: Story = {
  args: {
    error: "Please upload at least one image.",
  },
  render: (args) => <InteractiveImageUpload {...args} />,
};
