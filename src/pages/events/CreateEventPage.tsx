import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";

import EventFormFields from "./components/EventFormFields";
import { getEventFormSchema, initialEventFormValues, type EventFormValues } from "./EventForm.schema";

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

  function handleCancel() {
    navigate("/club/events");
  }

  const pageTitle = formik.values.name.trim() || t("events.form.title");

  return (
    <>
      <Breadcrumbs title={pageTitle} />

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
            {t("events.form.submit")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default CreateEventPage;
