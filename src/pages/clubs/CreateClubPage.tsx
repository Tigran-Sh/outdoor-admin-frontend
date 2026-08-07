import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";

import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import ClubFormFields from "./components/ClubFormFields";
import { getClubFormSchema, initialClubFormValues, type ClubFormValues } from "./ClubProfile.schema";

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
          <form noValidate onSubmit={formik.handleSubmit}>
            <ClubFormFields formik={formik} />
          </form>
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button appearance="outline" variant="secondary" onClick={handleCancel}>
            {t("clubs.form.cancel")}
          </Button>

          <Button
            type="button"
            variant="success"
            loading={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
          >
            {t("clubs.form.submit")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default CreateClubPage;
