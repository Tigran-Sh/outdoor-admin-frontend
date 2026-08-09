import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "@/components/ui/Button/Button";

import Stepper from "./Stepper";
import type { StepperStep, StepperVariant } from "./Stepper.types";

const steps: StepperStep[] = [
  { id: "general", label: "General" },
  { id: "description", label: "Description" },
  { id: "finish", label: "Finish" },
];

const variants: StepperVariant[] = ["pills", "arrow", "vertical"];

const meta = {
  title: "UI/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
  },
  args: {
    steps,
    activeStep: 0,
    variant: "pills",
  },
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: (args) => (
    <div className="d-flex flex-column gap-5">
      {variants.map((variant) => (
        <div key={variant}>
          <p className="text-muted mb-2">{variant}</p>
          <Stepper {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    function InteractiveStepper() {
      const [activeStep, setActiveStep] = useState(0);

      return (
        <div>
          <Stepper {...args} activeStep={activeStep} onStepChange={setActiveStep} />

          <div className="d-flex align-items-start gap-3 mt-4">
            <Button
              appearance="outline"
              variant="secondary"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            >
              Back
            </Button>
            <Button
              variant="success"
              className="ms-auto"
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep((step) => Math.min(steps.length - 1, step + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      );
    }

    return <InteractiveStepper />;
  },
};
