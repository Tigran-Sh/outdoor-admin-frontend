export type StepperVariant = "pills" | "arrow" | "vertical";

export interface StepperStep {
  /** Unique, stable identifier for the step. */
  id: string;
  /** Visible (and screen-reader) label for the step. Must already be translated by the caller. */
  label: string;
}

export interface StepperProps {
  /** Ordered list of steps to render. */
  steps: StepperStep[];
  /** Index (0-based) of the currently active step. */
  activeStep: number;
  /** Called with the clicked step's index. Omit to render a non-interactive indicator. */
  onStepChange?: (index: number) => void;
  /** Visual style of the stepper (numbered pills / arrow tabs / vertical list). */
  variant?: StepperVariant;
  /** Accessible label describing the sequence of steps (e.g. "Signup steps"). */
  ariaLabel?: string;
  className?: string;
}
