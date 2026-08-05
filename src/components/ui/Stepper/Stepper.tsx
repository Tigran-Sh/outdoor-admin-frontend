import type { ReactNode } from "react";

import type { StepperProps } from "./Stepper.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function getNavLinkClassName(index: number, activeStep: number, extra?: string) {
  return joinClassNames(
    "nav-link",
    index === activeStep && "active",
    index < activeStep && "done",
    extra,
  );
}

function StepButton({
  index,
  activeStep,
  onStepChange,
  extraClassName,
  children,
}: {
  index: number;
  activeStep: number;
  onStepChange?: StepperProps["onStepChange"];
  extraClassName?: string;
  children: ReactNode;
}) {
  return (
    <li className="nav-item">
      <button
        type="button"
        className={getNavLinkClassName(index, activeStep, extraClassName)}
        onClick={() => onStepChange?.(index)}
        aria-current={index === activeStep ? "step" : undefined}
      >
        {children}
      </button>
    </li>
  );
}

function Stepper({
  steps,
  activeStep,
  onStepChange,
  variant = "pills",
  ariaLabel,
  className,
}: StepperProps) {
  if (variant === "arrow") {
    return (
      <ul
        className={joinClassNames("nav nav-pills nav-justified step-arrow-nav", className)}
        aria-label={ariaLabel}
      >
        {steps.map((step, index) => (
          <StepButton
            key={step.id}
            index={index}
            activeStep={activeStep}
            onStepChange={onStepChange}
          >
            {step.label}
          </StepButton>
        ))}
      </ul>
    );
  }

  if (variant === "vertical") {
    return (
      <ul
        className={joinClassNames("nav flex-column vertical-navs-step", className)}
        aria-label={ariaLabel}
      >
        {steps.map((step, index) => (
          <StepButton
            key={step.id}
            index={index}
            activeStep={activeStep}
            onStepChange={onStepChange}
          >
            <i className="ri-close-circle-fill step-icon me-2" aria-hidden="true" />
            <span className="step-title">{step.label}</span>
          </StepButton>
        ))}
      </ul>
    );
  }

  const progress = steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className={joinClassNames("progress-nav", className)}>
      <div
        className="progress"
        style={{ height: 1 }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <ul className="nav nav-pills" aria-label={ariaLabel}>
        {steps.map((step, index) => (
          <StepButton
            key={step.id}
            index={index}
            activeStep={activeStep}
            onStepChange={onStepChange}
            extraClassName="rounded-pill"
          >
            {index + 1}
            <span className="visually-hidden"> {step.label}</span>
          </StepButton>
        ))}
      </ul>
    </div>
  );
}

export default Stepper;
