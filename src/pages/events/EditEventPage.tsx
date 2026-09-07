import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { getEvent, updateEvent } from "@/services/events.api";
import { listTeamMembers } from "@/services/teamMembers.api";
import { ApiError } from "@/types/apiError";
import { eventToFormValues } from "@/types/event";

import EventFormFields from "./components/EventFormFields";
import {
  getEventFormSchema,
  getEventFormSteps,
  initialEventFormValues,
  type EventFormValues,
} from "./EventForm.schema";

function EditEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [saveError, setSaveError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const eventQuery = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id as string),
    enabled: Boolean(id),
    retry: false,
  });
  const event = eventQuery.data;
  const isReadOnly = event?.status === "cancelled";

  const guidesQuery = useQuery({
    queryKey: ["team-members-all"],
    queryFn: () => listTeamMembers({ page_size: 200 }),
  });
  const guideOptions = (guidesQuery.data?.results ?? []).map((member) => ({
    id: member.id,
    name: member.fullName,
  }));

  const initialValues = useMemo(
    () => (event ? eventToFormValues(event) : initialEventFormValues),
    [event],
  );

  async function persist(values: EventFormValues) {
    if (!id) return null;
    setIsSaving(true);
    setSaveError(undefined);
    try {
      return await updateEvent(id, values);
    } catch (error) {
      setSaveError(error instanceof ApiError ? error.generalMessage() : t("events.form.saveError"));
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  const formik = useFormik<EventFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: getEventFormSchema(t),
    onSubmit: () => undefined,
  });

  /**
   * Saving from any step intentionally bypasses the wizard's full-schema
   * validation (which requires fields from every step) -- otherwise saving
   * partial progress from an early step would silently fail with no visible
   * error, since the blocking field lives on a step that isn't rendered.
   * `updateEvent` already omits empty fields, so this is a safe partial save.
   */
  async function handleSaveChanges() {
    const updated = await persist(formik.values);
    if (updated) navigate(`/club/events/${updated.id}`);
  }

  useRevalidateOnLanguageChange(formik.validateForm);

  const steps = getEventFormSteps(t);
  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  async function handleNext() {
    await goNext();
  }

  function handleCancel() {
    navigate(event ? `/club/events/${event.id}` : "/club/events");
  }

  if (eventQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (eventQuery.isError || !event) {
    return (
      <>
        <Breadcrumbs
          title={t("events.view.notFound")}
          items={[{ label: t("sidebar.events"), to: "/club/events" }]}
        />

        <Card>
          <CardBody>
            <p className="text-muted mb-3">{t("events.view.notFoundMessage")}</p>
            <Link to="/club/events" className="btn btn-primary">
              {t("events.view.backToEvents")}
            </Link>
          </CardBody>
        </Card>
      </>
    );
  }

  const pageTitle = formik.values.name.trim() || t("events.form.editTitle");

  return (
    <>
      <Breadcrumbs
        title={pageTitle}
        items={[
          { label: t("sidebar.events"), to: "/club/events" },
          { label: event.title, to: `/club/events/${event.id}` },
        ]}
      />

      <Card>
        <CardBody>
          {isReadOnly && (
            <div className="alert alert-warning">{t("events.view.cancelledReadOnly")}</div>
          )}

          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={handleStepClick}
            variant="arrow"
            className="mb-4"
            ariaLabel={t("events.form.editTitle")}
          />

          <form noValidate onSubmit={(event) => event.preventDefault()}>
            <EventFormFields
              formik={formik}
              activeStep={activeStep}
              guideOptions={guideOptions}
              currentCoverImageUrl={event.coverImage}
              currentGalleryImages={event.galleryImages}
            />
          </form>

          {saveError && <div className="text-danger fs-13 mt-2">{saveError}</div>}
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button appearance="outline" variant="secondary" onClick={handleCancel}>
            {t("events.form.cancel")}
          </Button>

          {!isFirstStep && (
            <Button appearance="outline" variant="secondary" onClick={goBack}>
              {t("common.stepper.back")}
            </Button>
          )}

          {!isLastStep && (
            <Button appearance="outline" variant="success" disabled={isReadOnly} onClick={handleNext}>
              {t("common.stepper.next")}
            </Button>
          )}

          <Button
            type="button"
            variant="success"
            loading={isSaving}
            disabled={isReadOnly}
            onClick={handleSaveChanges}
          >
            {t("events.form.saveChanges")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default EditEventPage;
