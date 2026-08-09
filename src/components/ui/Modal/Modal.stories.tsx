import { useState } from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "@/components/ui/Button/Button";

import Modal from "./Modal";
import type { ModalSize } from "./Modal.types";

const sizes: ModalSize[] = ["sm", "md", "lg", "xl"];

const meta = {
  title: "UI/Modal",
  component: Modal,
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
    isOpen: true,
    title: "Modal title",
    size: "md",
    centered: true,
    scrollable: false,
    children: "Modal body content.",
    onClose: () => {},
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractiveModal(args: ComponentProps<typeof Modal>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export const Playground: Story = {
  render: (args) => <InteractiveModal {...args} />,
};

export const WithFooter: Story = {
  render: (args) => (
    <InteractiveModal
      {...args}
      footer={
        <>
          <Button appearance="outline" variant="secondary">
            Close
          </Button>
          <Button variant="success">Save</Button>
        </>
      }
    />
  ),
};

export const Scrollable: Story = {
  render: (args) => (
    <InteractiveModal {...args} scrollable>
      {Array.from({ length: 30 }).map((_, index) => (
        <p key={index}>Line {index + 1} of scrollable content.</p>
      ))}
    </InteractiveModal>
  ),
};
