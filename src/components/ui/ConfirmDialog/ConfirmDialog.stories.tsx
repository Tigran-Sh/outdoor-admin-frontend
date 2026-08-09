import { useState } from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "@/components/ui/Button/Button";

import ConfirmDialog from "./ConfirmDialog";

const meta = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: true,
    title: "Are you sure?",
    message: "This action cannot be undone.",
    confirmLabel: "Yes, delete it",
    cancelLabel: "Cancel",
    confirmVariant: "danger",
    icon: "ri-delete-bin-line",
    loading: false,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractiveConfirmDialog(args: ComponentProps<typeof ConfirmDialog>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete event
      </Button>
      <ConfirmDialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export const Playground: Story = {
  render: (args) => <InteractiveConfirmDialog {...args} />,
};

export const CancelAction: Story = {
  args: {
    title: "Cancel this event?",
    message: "Participants will be notified that the event was cancelled.",
    confirmLabel: "Yes, cancel event",
    cancelLabel: "Keep event",
    confirmVariant: "warning",
    icon: "ri-error-warning-line",
  },
  render: (args) => <InteractiveConfirmDialog {...args} />,
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => <InteractiveConfirmDialog {...args} />,
};
