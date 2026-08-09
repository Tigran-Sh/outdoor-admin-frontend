import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";

import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import EventFormFields from "./components/EventFormFields";
import { getEventById, toEventFormValues } from "./EventsPage.data";
import { getEventFormSchema, type EventFormValues } from "./EventForm.schema";

function EditEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const event = id ? getEventById(id) : undefined;

  const formik = useFormik<EventFormValues>({
    initialValues: event
      ? toEventFormValues(event)
      : {
          name: "",
          category: "",
          region: "",
          description: "",
          date: "",
          time: "",
          durationType: "single",
          endDate: "",
          guideId: "",
          sweepGuideId: "",
          languageIds: [],
          difficultyIds: [],
          distanceKm: "",
          elevationGainM: "",
          meetingPointDescription: "",
          meetingPointCoordinates: "",
          maxParticipants: "",
          priceType: "",
          price: "",
          whatIsNecessary: "",
          includedItems: "",
          excludedItems: "",
          cancellationPolicy: "",
          additionalInfo: "",
          coverImage: [],
          galleryImages: [],
        },
    validationSchema: getEventFormSchema(t),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      navigate("/club/events", { state: { updatedEvent: values, eventId: id } });
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  function handleCancel() {
    navigate(event ? `/club/events/${event.id}` : "/club/events");
  }

  if (!event) {
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
          { label: event.name, to: `/club/events/${event.id}` },
        ]}
      />

      <Card>
        <CardBody>
          <form noValidate onSubmit={formik.handleSubmit}>
            <EventFormFields formik={formik} />
          </form>
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button appearance="outline" variant="secondary" onClick={handleCancel}>
            {t("events.form.cancel")}
          </Button>

          <Button
            type="button"
            variant="success"
            loading={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
          >
            {t("events.form.saveChanges")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default EditEventPage;
