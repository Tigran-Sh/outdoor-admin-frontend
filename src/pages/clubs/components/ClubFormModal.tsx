import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";

import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import ClubFormFields from "./ClubFormFields";
import { getClubFormSchema, type ClubFormValues } from "../ClubProfile.schema";

interface ClubFormModalProps {
  isOpen: boolean;
  initialValues: ClubFormValues;
  onClose: () => void;
  onSubmit: (values: ClubFormValues) => void;
}

function ClubFormModal({ isOpen, initialValues, onClose, onSubmit }: ClubFormModalProps) {
  const { t } = useTranslation();

  const formik = useFormik<ClubFormValues>({
    initialValues,
    validationSchema: getClubFormSchema(t),
    onSubmit: (values, { resetForm, setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
      resetForm();
      onClose();
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("clubs.form.editTitle")}
      size="lg"
      scrollable
      footer={
        <>
          <Button appearance="outline" variant="secondary" onClick={handleClose}>
            {t("clubs.form.cancel")}
          </Button>

          <Button
            type="button"
            variant="success"
            loading={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
          >
            {t("clubs.form.saveChanges")}
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={formik.handleSubmit}>
        <ClubFormFields formik={formik} />
      </form>
    </Modal>
  );
}

export default ClubFormModal;
