import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Select from "@/components/ui/Select/Select";
import Stepper from "@/components/ui/Stepper/Stepper";

import { useFormWizard, type FormWizardStep } from "@/hooks/useFormWizard";
import { createAdminClub, listAvailableClubOwners } from "@/services/clubs.api";
import { ApiError } from "@/types/apiError";
import { initialClubFormValues, type ClubFormValues } from "@/types/club";

import ClubFormFields from "./components/ClubFormFields";
import { getClubFormSchema, getClubFormSteps } from "./ClubProfile.schema";

function CreateClubPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ownerId, setOwnerId] = useState("");
  const [ownerError, setOwnerError] = useState<string>();
  const [generalError, setGeneralError] = useState<string>();

  const ownersQuery = useQuery({
    queryKey: ["admin-club-available-owners"],
    queryFn: () => listAvailableClubOwners(),
  });
  const owners = ownersQuery.data ?? [];

  const formik = useFormik<ClubFormValues>({
    initialValues: initialClubFormValues,
    validationSchema: getClubFormSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      setGeneralError(undefined);
      if (!ownerId) {
        setOwnerError(t("clubs.form.validation.ownerRequired"));
        setSubmitting(false);
        return;
      }

      try {
        const club = await createAdminClub(values, ownerId);
        navigate(`/admin/clubs/${club.id}`);
      } catch (error) {
        if (error instanceof ApiError) {
          setOwnerError(error.fieldError("owner"));
          setGeneralError(error.generalMessage());
        } else {
          setGeneralError(t("clubs.form.saveError"));
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const steps: FormWizardStep<ClubFormValues>[] = getClubFormSteps(t);

  const { activeStep, isFirstStep, isLastStep, goNext, goBack, handleStepClick } = useFormWizard(
    formik,
    steps,
  );

  const isGeneralStep = activeStep === 0;

  async function handleNext() {
    if (isGeneralStep) {
      if (!ownerId) {
        setOwnerError(t("clubs.form.validation.ownerRequired"));
        return;
      }
      setOwnerError(undefined);
    }
    await goNext();
  }

  return (
    <>
      <Breadcrumbs
        title={t("clubs.form.title")}
        items={[{ label: t("sidebar.clubs"), to: "/admin/clubs" }]}
      />

      <Card>
        <CardBody>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={handleStepClick}
            variant="arrow"
            className="mb-4"
            ariaLabel={t("clubs.form.title")}
          />

          <form noValidate onSubmit={formik.handleSubmit}>
            {isGeneralStep && (
              <Select
                label={t("clubs.form.fields.owner.label")}
                name="owner"
                onChange={(event) => {
                  setOwnerId(event.target.value);
                  setOwnerError(undefined);
                }}
                value={ownerId}
                error={ownerError}
                helperText={t("clubs.form.fields.owner.helperText")}
                disabled={ownersQuery.isLoading}
              >
                <option value="">{t("clubs.form.fields.owner.placeholder")}</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.fullName} ({owner.email})
                  </option>
                ))}
              </Select>
            )}
            <ClubFormFields formik={formik} activeStep={activeStep} />
          </form>

          {generalError && <div className="text-danger fs-13 mt-2">{generalError}</div>}
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button
            type="button"
            appearance="outline"
            variant="secondary"
            onClick={() => navigate("/admin/clubs")}
          >
            {t("clubs.form.cancel")}
          </Button>

          {!isFirstStep && (
            <Button type="button" appearance="outline" variant="secondary" onClick={goBack}>
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
              {t("clubs.form.submit")}
            </Button>
          ) : (
            <Button type="button" variant="success" onClick={handleNext}>
              {t("common.stepper.next")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

export default CreateClubPage;
