import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";

import EventFormFields from "./EventFormFields";
import { getEventFormSchema, type EventFormValues } from "../EventForm.schema";

interface EventFormModalProps {
  isOpen: boolean;
  initialValues: EventFormValues;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => void;
}

function EventFormModal({ isOpen, initialValues, onClose, onSubmit }: EventFormModalProps) {
  const { t } = useTranslation();

  const formik = useFormik<EventFormValues>({
    initialValues,
    validationSchema: getEventFormSchema(t),
    onSubmit: (values, { resetForm, setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
      resetForm();
      onClose();
    },
  });

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("events.form.editTitle")}
      size="lg"
      footer={
        <>
          <Button appearance="outline" variant="secondary" onClick={handleClose}>
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
        </>
      }
    >
      <form noValidate onSubmit={formik.handleSubmit}>
        <EventFormFields formik={formik} />
      </form>
    </Modal>
  );
}

export default EventFormModal;
