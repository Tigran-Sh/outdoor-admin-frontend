import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import EventFormFields from "./components/EventFormFields";
import {
  getEventFormSchema,
  getEventFormSteps,
  initialEventFormValues,
  type EventFormValues,
} from "./EventForm.schema";

function CreateEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik<EventFormValues>({
    initialValues: initialEventFormValues,
    validationSchema: getEventFormSchema(t),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      navigate("/club/events", { state: { createdEvent: values } });
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  const steps = getEventFormSteps(t);
  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  function handleCancel() {
    navigate("/club/events");
  }

  const pageTitle = formik.values.name.trim() || t("events.form.title");

  return (
    <>
      <Breadcrumbs
        title={pageTitle}
        items={[{ label: t("sidebar.events"), to: "/club/events" }]}
      />

      <Card>
        <CardBody>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={handleStepClick}
            variant="arrow"
            className="mb-4"
            ariaLabel={t("events.form.title")}
          />

          <form noValidate onSubmit={formik.handleSubmit}>
            <EventFormFields formik={formik} activeStep={activeStep} />
          </form>
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button
            appearance="outline"
            variant="secondary"
            onClick={handleCancel}
          >
            {t("events.form.cancel")}
          </Button>

          {!isFirstStep && (
            <Button appearance="outline" variant="secondary" onClick={goBack}>
              {t("common.stepper.back")}
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="button"
              variant="success"
              loading={formik.isSubmitting}
              onClick={() => formik.handleSubmit()}
            >
              {t("events.form.submit")}
            </Button>
          ) : (
            <Button type="button" variant="success" onClick={goNext}>
              {t("common.stepper.next")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

export default CreateEventPage;
