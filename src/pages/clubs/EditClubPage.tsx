import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";

import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import ClubFormFields from "./components/ClubFormFields";
import { getClubById, toClubFormValues } from "./ClubsPage.data";
import { getClubFormSchema, initialClubFormValues, type ClubFormValues } from "./ClubProfile.schema";

function EditClubPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const club = id ? getClubById(id) : undefined;

  const formik = useFormik<ClubFormValues>({
    initialValues: club ? toClubFormValues(club) : initialClubFormValues,
    validationSchema: getClubFormSchema(t),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      navigate("/admin/clubs", { state: { updatedClub: values, clubId: id } });
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  function handleCancel() {
    navigate(club ? `/admin/clubs/${club.id}` : "/admin/clubs");
  }

  if (!club) {
    return (
      <>
        <Breadcrumbs
          title={t("clubs.view.notFound")}
          items={[{ label: t("sidebar.clubs"), to: "/admin/clubs" }]}
        />

        <Card>
          <CardBody>
            <p className="text-muted mb-3">{t("clubs.view.notFoundMessage")}</p>
            <Link to="/admin/clubs" className="btn btn-primary">
              {t("clubs.view.backToClubs")}
            </Link>
          </CardBody>
        </Card>
      </>
    );
  }

  const pageTitle = formik.values.name.trim() || t("clubs.form.editTitle");

  return (
    <>
      <Breadcrumbs
        title={pageTitle}
        items={[
          { label: t("sidebar.clubs"), to: "/admin/clubs" },
          { label: club.name, to: `/admin/clubs/${club.id}` },
        ]}
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
            {t("clubs.form.saveChanges")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default EditClubPage;
