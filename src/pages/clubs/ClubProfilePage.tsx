import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";

import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import ClubFormFields from "./components/ClubFormFields";
import { mockClubs } from "./ClubsPage.data";
import { getClubFormSchema, type ClubFormValues } from "./ClubProfile.schema";

const myClub = mockClubs[0];

const myClubFormValues: ClubFormValues = {
  name: myClub.name,
  logo: myClub.logo,
  coverImage: myClub.coverImage,
  about: myClub.about,
  activityTypeIds: myClub.activityTypeIds,
  baseRegion: myClub.baseRegion,
  yearFounded: myClub.yearFounded,
  email: myClub.email,
  phone: myClub.phone,
  instagram: myClub.instagram,
  facebook: myClub.facebook,
  telegram: myClub.telegram,
  website: myClub.website,
  entityType: myClub.entityType,
  taxId: myClub.taxId,
  ownerIdDocument: myClub.ownerIdDocument,
};

function ClubProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik<ClubFormValues>({
    initialValues: myClubFormValues,
    validationSchema: getClubFormSchema(t),
    onSubmit: (_values, { setSubmitting }) => {
      setSubmitting(false);
      navigate("/club/profile");
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  return (
    <>
      <Breadcrumbs
        title={t("clubs.form.editTitle")}
        items={[{ label: myClub.name, to: "/club/profile" }]}
      />

      <Card>
        <CardBody>
          <form noValidate onSubmit={formik.handleSubmit}>
            <ClubFormFields formik={formik} />
          </form>
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button
            appearance="outline"
            variant="secondary"
            onClick={() => navigate("/club/profile")}
          >
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

export default ClubProfilePage;
