import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";

import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { getMyClub, updateMyClub } from "@/services/clubs.api";
import { ApiError } from "@/types/apiError";
import { clubToFormValues, initialClubFormValues, type ClubFormValues } from "@/types/club";

import ClubFormFields from "./components/ClubFormFields";
import { getClubFormSchema } from "./ClubProfile.schema";

function ClubProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clubQuery = useQuery({ queryKey: ["my-club"], queryFn: getMyClub, retry: false });
  const club = clubQuery.data;

  const updateMutation = useMutation({ mutationFn: updateMyClub });

  const formik = useFormik<ClubFormValues>({
    enableReinitialize: true,
    initialValues: club ? clubToFormValues(club) : initialClubFormValues,
    validationSchema: getClubFormSchema(t, { hasOwnerIdDocument: club?.hasOwnerIdDocument }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(undefined);
      try {
        const updated = await updateMutation.mutateAsync(values);
        queryClient.setQueryData(["my-club"], updated);
        navigate("/club/profile");
      } catch (error) {
        setStatus(error instanceof ApiError ? error.message : t("clubs.form.saveError"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  if (clubQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const notFound = clubQuery.error instanceof ApiError && clubQuery.error.status === 404;

  if (notFound) {
    return (
      <>
        <Breadcrumbs title={t("clubs.form.editTitle")} />
        <Card>
          <CardBody>
            <p className="text-muted mb-0">{t("clubs.view.noClubMessage")}</p>
          </CardBody>
        </Card>
      </>
    );
  }

  if (clubQuery.isError) {
    return (
      <div className="alert alert-danger d-flex align-items-center justify-content-between">
        <span>{t("common.loadError")}</span>
        <Button variant="danger" appearance="outline" size="sm" onClick={() => clubQuery.refetch()}>
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs
        title={t("clubs.form.editTitle")}
        items={club ? [{ label: club.name, to: "/club/profile" }] : []}
      />

      <Card>
        <CardBody>
          <form noValidate onSubmit={formik.handleSubmit}>
            <ClubFormFields
              formik={formik}
              currentLogoUrl={club?.logo}
              currentCoverImageUrl={club?.coverImage}
              hasOwnerIdDocument={club?.hasOwnerIdDocument}
            />
          </form>

          {formik.status && <div className="text-danger fs-13 mt-2">{formik.status}</div>}
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Link to="/club/profile" className="btn btn-outline-secondary">
            {t("clubs.form.cancel")}
          </Link>

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
