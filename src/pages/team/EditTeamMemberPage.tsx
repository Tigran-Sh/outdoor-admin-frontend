import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import TeamMemberFormFields from "./components/TeamMemberFormFields";
import { getTeamMemberById, getTeamMemberFullName, toTeamMemberFormValues } from "./TeamPage.data";
import {
  getTeamMemberFormSchema,
  getTeamMemberFormSteps,
  type TeamMemberFormValues,
} from "./TeamMember.schema";

function EditTeamMemberPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const member = id ? getTeamMemberById(id) : undefined;

  const formik = useFormik<TeamMemberFormValues>({
    initialValues: member
      ? toTeamMemberFormValues(member)
      : {
          firstName: "",
          lastName: "",
          photo: [],
          phone: "",
          email: "",
          birthDate: "",
          role: "",
          permissionIds: [],
          activityTypeIds: [],
          languageIds: [],
          experienceYears: "",
          bio: "",
          certificates: [],
          assignedEventIds: [],
          isActive: true,
        },
    validationSchema: getTeamMemberFormSchema(t),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      navigate("/club/team", { state: { updatedMember: values, memberId: id } });
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  const steps = getTeamMemberFormSteps(t);
  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  function handleCancel() {
    navigate(member ? `/club/team/${member.id}` : "/club/team");
  }

  if (!member) {
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

  const pageTitle =
    `${formik.values.firstName} ${formik.values.lastName}`.trim() || t("team.form.editTitle");

  return (
    <>
      <Breadcrumbs
        title={pageTitle}
        items={[
          { label: t("sidebar.team"), to: "/club/team" },
          { label: getTeamMemberFullName(member), to: `/club/team/${member.id}` },
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
