import { useRef, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { createEvent, updateEvent } from "@/services/events.api";
import { listTeamMembers } from "@/services/teamMembers.api";
import { ApiError } from "@/types/apiError";
import type { Event } from "@/types/event";

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

  const [eventId, setEventId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * The wizard autosaves after every step (see `handleNext`), but
   * `gallery_images` is an additive field on the backend -- each request
   * appends whatever files it's sent, rather than replacing the gallery.
   * Resending the same `File` objects on every subsequent autosave would
   * re-append (and duplicate) them, so we only ever send gallery files that
   * haven't already been synced to the server.
   */
  const syncedGalleryFilesRef = useRef<File[]>([]);

  const guidesQuery = useQuery({
    queryKey: ["team-members-all"],
    queryFn: () => listTeamMembers({ page_size: 200 }),
  });
  const guideOptions = (guidesQuery.data?.results ?? []).map((member) => ({
    id: member.id,
    name: member.fullName,
  }));

  async function persist(values: EventFormValues): Promise<Event | null> {
    setIsSaving(true);
    setSaveError(undefined);
    try {
      const newGalleryImages = values.galleryImages.filter(
        (file) => !syncedGalleryFilesRef.current.includes(file),
      );
      const payload = { ...values, galleryImages: newGalleryImages };
      const event = eventId ? await updateEvent(eventId, payload) : await createEvent(payload);
      syncedGalleryFilesRef.current = [...syncedGalleryFilesRef.current, ...newGalleryImages];
      setEventId(event.id);
      return event;
    } catch (error) {
      setSaveError(error instanceof ApiError ? error.generalMessage() : t("events.form.saveError"));
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  const formik = useFormik<EventFormValues>({
    initialValues: initialEventFormValues,
    validationSchema: getEventFormSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      const event = await persist(values);
      setSubmitting(false);
      if (event) navigate(`/club/events/${event.id}`);
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  const steps = getEventFormSteps(t);
  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  async function handleNext() {
    const advanced = await goNext();
    if (advanced) await persist(formik.values);
  }

  function handleCancel() {
    navigate(eventId ? `/club/events/${eventId}` : "/club/events");
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
            <EventFormFields
              formik={formik}
              activeStep={activeStep}
              guideOptions={guideOptions}
            />
          </form>

          {saveError && <div className="text-danger fs-13 mt-2">{saveError}</div>}
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
              loading={formik.isSubmitting || isSaving}
              onClick={() => formik.handleSubmit()}
            >
              {t("events.form.submit")}
            </Button>
          ) : (
            <Button type="button" variant="success" loading={isSaving} onClick={handleNext}>
              {t("common.stepper.next")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

export default CreateEventPage;
