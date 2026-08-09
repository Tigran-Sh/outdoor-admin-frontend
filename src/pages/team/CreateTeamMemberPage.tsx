import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";

import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import TeamMemberFormFields from "./components/TeamMemberFormFields";
import {
  getTeamMemberFormSchema,
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
          <form noValidate onSubmit={formik.handleSubmit}>
            <TeamMemberFormFields formik={formik} />
          </form>
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button appearance="outline" variant="secondary" onClick={handleCancel}>
            {t("team.form.cancel")}
          </Button>

          <Button
            type="button"
            variant="success"
            loading={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
          >
            {t("team.form.submit")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default CreateTeamMemberPage;
