import { useMemo } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { getTeamMember, updateTeamMember } from "@/services/teamMembers.api";
import { ApiError } from "@/types/apiError";
import {
  initialTeamMemberFormValues,
  teamMemberToFormValues,
  type TeamMemberFormValues,
} from "@/types/teamMember";

import TeamMemberFormFields from "./components/TeamMemberFormFields";
import { getTeamMemberFormSchema, getTeamMemberFormSteps } from "./TeamMember.schema";

function EditTeamMemberPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const memberQuery = useQuery({
    queryKey: ["team-member", id],
    queryFn: () => getTeamMember(id as string),
    enabled: Boolean(id),
    retry: false,
  });
  const member = memberQuery.data;

  const updateMutation = useMutation({
    mutationFn: (values: TeamMemberFormValues) => updateTeamMember(id as string, values),
  });

  const initialValues = useMemo(
    () => (member ? teamMemberToFormValues(member) : initialTeamMemberFormValues),
    [member],
  );

  const formik = useFormik<TeamMemberFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: getTeamMemberFormSchema(t, "edit"),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(undefined);
      try {
        const updated = await updateMutation.mutateAsync(values);
        queryClient.setQueryData(["team-member", id], updated);
        queryClient.invalidateQueries({ queryKey: ["team-members"] });
        navigate("/club/team");
      } catch (error) {
        setStatus(error instanceof ApiError ? error.message : t("team.form.saveError"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  const steps = getTeamMemberFormSteps(t, "edit");
  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  function handleCancel() {
    navigate(member ? `/club/team/${member.id}` : "/club/team");
  }

  if (memberQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (memberQuery.isError || !member) {
    return (
      <>
        <Breadcrumbs
          title={t("team.view.notFound")}
          items={[{ label: t("sidebar.team"), to: "/club/team" }]}
        />

        <Card>
          <CardBody>
            <p className="text-muted mb-3">{t("team.view.notFoundMessage")}</p>
            <Link to="/club/team" className="btn btn-primary">
              {t("team.view.backToTeam")}
            </Link>
          </CardBody>
        </Card>
      </>
    );
  }

  const pageTitle = formik.values.fullName.trim() || t("team.form.editTitle");

  return (
    <>
      <Breadcrumbs
        title={pageTitle}
        items={[
          { label: t("sidebar.team"), to: "/club/team" },
          { label: member.fullName, to: `/club/team/${member.id}` },
        ]}
      />

      <Card>
        <CardBody>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={handleStepClick}
            variant="arrow"
            className="mb-4"
            ariaLabel={t("team.form.editTitle")}
          />

          <form noValidate onSubmit={formik.handleSubmit}>
            <TeamMemberFormFields
              formik={formik}
              activeStep={activeStep}
              mode="edit"
              currentPhotoUrl={member.photo}
              currentCertificates={member.certificates}
            />
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
              {t("team.form.saveChanges")}
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

export default EditTeamMemberPage;
