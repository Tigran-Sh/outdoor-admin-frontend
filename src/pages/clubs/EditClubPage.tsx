import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter, CardHeader } from "@/components/ui/Card/Card";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Select from "@/components/ui/Select/Select";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard } from "@/hooks/useFormWizard";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { getAdminClub, updateAdminClub } from "@/services/clubs.api";
import { ApiError } from "@/types/apiError";
import {
  CLUB_STATUSES,
  clubToFormValues,
  initialClubFormValues,
  type ClubFormValues,
  type ClubStatus,
} from "@/types/club";

import ClubFormFields from "./components/ClubFormFields";
import { getClubFormSchema, getClubFormSteps } from "./ClubProfile.schema";

function EditClubPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [status, setStatus] = useState<ClubStatus>("draft");
  const [identityVerified, setIdentityVerified] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const clubQuery = useQuery({
    queryKey: ["admin-club", id],
    queryFn: () => getAdminClub(id as string),
    enabled: Boolean(id),
    retry: false,
  });
  const club = clubQuery.data;

  // Seed the admin-only fields from the fetched club once, without a
  // useEffect (see https://react.dev/learn/you-might-not-need-an-effect).
  const [loadedClubId, setLoadedClubId] = useState<string>();
  if (club && club.id !== loadedClubId) {
    setLoadedClubId(club.id);
    setStatus(club.status);
    setIdentityVerified(club.identityVerified);
    setPaymentVerified(club.paymentVerified);
  }

  const updateMutation = useMutation({
    mutationFn: (values: ClubFormValues) =>
      updateAdminClub(id as string, values, { status, identityVerified, paymentVerified }),
  });

  const formik = useFormik<ClubFormValues>({
    enableReinitialize: true,
    initialValues: club ? clubToFormValues(club) : initialClubFormValues,
    validationSchema: getClubFormSchema(t, { hasOwnerIdDocument: club?.hasOwnerIdDocument }),
    onSubmit: () => undefined,
  });

  /**
   * Saving from any step intentionally bypasses the wizard's full-schema
   * validation -- otherwise saving partial progress from an early step
   * could silently fail with no visible error if a later, not-currently-
   * rendered step happened to be invalid.
   */
  async function handleSaveChanges() {
    if (!id) return;
    setSaveError(undefined);
    setIsSaving(true);
    try {
      const updated = await updateMutation.mutateAsync(formik.values);
      queryClient.setQueryData(["admin-club", id], updated);
      queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
      navigate(`/admin/clubs/${id}`);
    } catch (error) {
      setSaveError(error instanceof ApiError ? error.generalMessage() : t("clubs.form.saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  useRevalidateOnLanguageChange(formik.validateForm);

  const steps = getClubFormSteps(t);
  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  function handleCancel() {
    navigate(club ? `/admin/clubs/${club.id}` : "/admin/clubs");
  }

  if (clubQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (clubQuery.isError || !club) {
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

  return (
    <>
      <Breadcrumbs
        title={club.name}
        items={[
          { label: t("sidebar.clubs"), to: "/admin/clubs" },
          { label: club.name, to: `/admin/clubs/${club.id}` },
        ]}
      />

      <Card>
        <CardHeader title={t("clubs.form.administration.title")} />
        <CardBody>
          <div className="row">
            <div className="col-sm-4">
              <Select
                label={t("clubs.form.fields.status.label")}
                value={status}
                onChange={(event) => setStatus(event.target.value as ClubStatus)}
                containerClassName="mb-0"
              >
                {CLUB_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {t(`clubs.workflowStatus.${value}`)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="col-sm-4 d-flex align-items-end">
              <Checkbox
                id="club-identity-verified"
                label={t("clubs.form.fields.identityVerified.label")}
                checked={identityVerified}
                onChange={(event) => setIdentityVerified(event.target.checked)}
              />
            </div>

            <div className="col-sm-4 d-flex align-items-end">
              <Checkbox
                id="club-payment-verified"
                label={t("clubs.form.fields.paymentVerified.label")}
                checked={paymentVerified}
                onChange={(event) => setPaymentVerified(event.target.checked)}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={handleStepClick}
            variant="arrow"
            className="mb-4"
            ariaLabel={club.name}
          />

          <form noValidate onSubmit={(event) => event.preventDefault()}>
            <ClubFormFields
              formik={formik}
              activeStep={activeStep}
              currentLogoUrl={club.logo}
              currentCoverImageUrl={club.coverImage}
              hasOwnerIdDocument={club.hasOwnerIdDocument}
            />
          </form>

          {saveError && <div className="text-danger fs-13 mt-2">{saveError}</div>}
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

          {!isLastStep && (
            <Button appearance="outline" variant="success" onClick={goNext}>
              {t("common.stepper.next")}
            </Button>
          )}

          <Button type="button" variant="success" loading={isSaving} onClick={handleSaveChanges}>
            {t("clubs.form.saveChanges")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default EditClubPage;
