import { useState } from "react";
import type { FormikErrors, FormikProps, FormikTouched } from "formik";

export interface FormWizardStep<Values> {
  id: string;
  label: string;
  fields: (keyof Values)[];
}

export function useFormWizard<Values extends object>(
  formik: FormikProps<Values>,
  steps: FormWizardStep<Values>[],
) {
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

  function goToStep(index: number) {
    setActiveStep(Math.min(Math.max(index, 0), steps.length - 1));
  }

  async function goNext() {
    const currentFields = steps[activeStep].fields;

    const touched: FormikTouched<Values> = { ...formik.touched };
    currentFields.forEach((field) => {
      (touched as Record<string, boolean>)[field as string] = true;
    });
    formik.setTouched(touched, false);

    const errors: FormikErrors<Values> = await formik.validateForm();
    const hasStepError = currentFields.some((field) =>
      Boolean((errors as Record<string, unknown>)[field as string]),
    );

    if (!hasStepError) {
      const nextStep = Math.min(activeStep + 1, steps.length - 1);
      setActiveStep(nextStep);
      setFurthestStep((step) => Math.max(step, nextStep));
    }
  }

  function goBack() {
    setActiveStep((step) => Math.max(step - 1, 0));
  }

  function handleStepClick(index: number) {
    if (index <= furthestStep) {
      goToStep(index);
    }
  }

  return {
    activeStep,
    furthestStep,
    isFirstStep,
    isLastStep,
    stepCount: steps.length,
    goNext,
    goBack,
    goToStep,
    handleStepClick,
  };
}
