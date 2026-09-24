import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { createTeamMember } from "@/services/teamMembers.api";
import { ApiError } from "@/types/apiError";
import { initialTeamMemberFormValues, type TeamMemberFormValues } from "@/types/teamMember";

import TeamMemberFormFields from "./components/TeamMemberFormFields";
import {
  getTeamMemberFormSchema,
  getTeamMemberFormSteps,
  mapTeamMemberApiFieldErrors,
} from "./TeamMember.schema";

function CreateTeamMemberPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({ mutationFn: createTeamMember });

  const steps = getTeamMemberFormSteps(t, "create");

  const formik = useFormik<TeamMemberFormValues>({
    initialValues: initialTeamMemberFormValues,
    validationSchema: getTeamMemberFormSchema(t, "create"),
    onSubmit: async (values, { setSubmitting, setStatus, setErrors, setTouched }) => {
      setStatus(undefined);
      try {
        await createMutation.mutateAsync(values);
        queryClient.invalidateQueries({ queryKey: ["team-members"] });
        navigate("/club/team");
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.details) {
            const fieldErrors = mapTeamMemberApiFieldErrors(error);
            if (Object.keys(fieldErrors).length > 0) {
              setErrors(fieldErrors);
              setTouched(
                Object.fromEntries(Object.keys(fieldErrors).map((field) => [field, true])),
                false,
              );

              // The erroring field may live on a step the admin isn't
              // currently viewing (e.g. a duplicate email caught on final
              // submit while step 2 is active) -- jump back to it so the
              // message is actually visible.
              const erroredStepIndex = steps.findIndex((step) =>
                step.fields.some((field) => field in fieldErrors),
              );
              if (erroredStepIndex !== -1) goToStep(erroredStepIndex);
            }
          }
          setStatus(error.generalMessage());
        } else {
          setStatus(t("team.form.saveError"));
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  const { activeStep, isFirstStep, isLastStep, goNext, goBack, goToStep, handleStepClick } =
    useFormWizard(formik, steps);

  function handleCancel() {
    navigate("/club/team");
  }

  const pageTitle = formik.values.fullName.trim() || t("team.form.title");

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
            <TeamMemberFormFields formik={formik} activeStep={activeStep} mode="create" />
          </form>

          {formik.status && <div className="text-danger fs-13 mt-2">{formik.status}</div>}
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
