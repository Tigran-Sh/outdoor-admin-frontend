import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import ClubFormFields from "./components/ClubFormFields";
import {
  getClubFormSchema,
  getClubFormSteps,
  initialClubFormValues,
  type ClubFormValues,
} from "./ClubProfile.schema";

function CreateClubPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik<ClubFormValues>({
    initialValues: initialClubFormValues,
    validationSchema: getClubFormSchema(t),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      navigate("/admin/clubs", { state: { createdClub: values } });
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  const steps = getClubFormSteps(t);
  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  function handleCancel() {
    navigate("/admin/clubs");
  }

  const pageTitle = formik.values.name.trim() || t("clubs.form.title");

  return (
    <>
      <Breadcrumbs
        title={pageTitle}
        items={[{ label: t("sidebar.clubs"), to: "/admin/clubs" }]}
      />

      <Card>
        <CardBody>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={handleStepClick}
            variant="arrow"
            className="mb-4"
            ariaLabel={t("clubs.form.title")}
          />

          <form noValidate onSubmit={formik.handleSubmit}>
            <ClubFormFields formik={formik} activeStep={activeStep} />
          </form>
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button appearance="outline" variant="secondary" onClick={handleCancel}>
            {t("clubs.form.cancel")}
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
              {t("clubs.form.submit")}
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

export default CreateClubPage;
