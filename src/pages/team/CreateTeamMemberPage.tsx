import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import TeamMemberFormFields from "./components/TeamMemberFormFields";
import {
  getTeamMemberFormSchema,
  getTeamMemberFormSteps,
  initialTeamMemberFormValues,
  type TeamMemberFormValues,
} from "./TeamMember.schema";

function CreateTeamMemberPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik<TeamMemberFormValues>({
    initialValues: initialTeamMemberFormValues,
    validationSchema: getTeamMemberFormSchema(t),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      navigate("/club/team", { state: { createdMember: values } });
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  const steps = getTeamMemberFormSteps(t);
  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  function handleCancel() {
    navigate("/club/team");
  }

  const pageTitle =
    `${formik.values.firstName} ${formik.values.lastName}`.trim() || t("team.form.title");

  return (
    <>
      <Breadcrumbs
        title={pageTitle}
        items={[{ label: t("sidebar.team"), to: "/club/team" }]}
      />

      <Card>
        <CardBody>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={handleStepClick}
            variant="arrow"
            className="mb-4"
            ariaLabel={t("team.form.title")}
          />

          <form noValidate onSubmit={formik.handleSubmit}>
            <TeamMemberFormFields formik={formik} activeStep={activeStep} />
          </form>
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button appearance="outline" variant="secondary" onClick={handleCancel}>
            {t("team.form.cancel")}
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
              {t("team.form.submit")}
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

export default CreateTeamMemberPage;
