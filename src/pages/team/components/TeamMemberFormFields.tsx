import type { FormikProps } from "formik";
import { useTranslation } from "react-i18next";

import Checkbox from "@/components/ui/Checkbox/Checkbox";
import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import Textarea from "@/components/ui/Textarea/Textarea";

import { useAuth } from "@/app/providers/useAuth";
import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import {
  TEAM_LANGUAGES,
  TEAM_MEMBER_PLATFORM_ROLES,
  type TeamMemberFormMode,
  type TeamMemberFormValues,
} from "@/types/teamMember";
import { generatePassword } from "@/utils/generatePassword";

interface ExistingCertificate {
  id: string;
  fileUrl: string;
}

interface TeamMemberFormFieldsProps {
  formik: FormikProps<TeamMemberFormValues>;
  activeStep: number;
  mode: TeamMemberFormMode;
  /** Current photo URL, shown until a new file replaces it (edit mode). */
  currentPhotoUrl?: string | null;
  /** Already-uploaded certificates (edit mode); the backend has no delete for these. */
  currentCertificates?: ExistingCertificate[];
}

function TeamMemberFormFields({
  formik,
  activeStep,
  mode,
  currentPhotoUrl,
  currentCertificates = [],
}: TeamMemberFormFieldsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  function toggleValue(
    field: "permissions" | "activityTypeIds" | "languageIds",
    value: string,
  ) {
    const current = formik.values[field];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    formik.setFieldValue(field, next);
  }

  const isInternalAdmin = formik.values.platformRole === "internal_admin";
  const grantableCapabilities = user?.capabilities ?? [];

  return (
    <>
      {activeStep === 0 && (
        <div className="mb-4">
          <div className="d-flex gap-3 align-items-start mb-2">
            <ImageUpload
              variant="avatar"
              label={t("team.form.fields.photo.label")}
              helperText={t("team.form.fields.photo.helperText")}
              value={formik.values.photo}
              existingImageUrl={currentPhotoUrl}
              onChange={(files) => formik.setFieldValue("photo", files)}
            />

            <div className="flex-grow-1">
              <Input
                label={t("team.form.fields.fullName.label")}
                name="fullName"
                placeholder={t("team.form.fields.fullName.placeholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
                error={
                  formik.touched.fullName ? formik.errors.fullName : undefined
                }
                containerClassName="mb-0"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <Input
                label={t("team.form.fields.email.label")}
                name="email"
                type="email"
                placeholder={t("team.form.fields.email.placeholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email ? formik.errors.email : undefined}
              />
            </div>

            <div className="col-sm-6">
              {mode === "create" && (
                <Input
                  label={t("team.form.fields.password.label")}
                  labelAddon={
                    <button
                      type="button"
                      className="btn btn-link p-0 text-muted text-decoration-none fs-13"
                      onClick={() => {
                        formik.setFieldValue("password", generatePassword());
                        formik.setFieldTouched("password", true, false);
                      }}
                    >
                      <i className="ri-refresh-line align-middle me-1" aria-hidden="true" />
                      {t("common.generatePassword")}
                    </button>
                  }
                  name="password"
                  type="password"
                  placeholder={t("team.form.fields.password.placeholder")}
                  helperText={t("team.form.fields.password.helperText")}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={
                    formik.touched.password ? formik.errors.password : undefined
                  }
                />
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <Input
                label={t("team.form.fields.phone.label")}
                name="phone"
                type="tel"
                placeholder={t("team.form.fields.phone.placeholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                error={formik.touched.phone ? formik.errors.phone : undefined}
              />
            </div>

            <div className="col-sm-6">
              <Input
                label={t("team.form.fields.birthDate.label")}
                name="birthDate"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.birthDate}
                error={
                  formik.touched.birthDate ? formik.errors.birthDate : undefined
                }
                containerClassName="mb-0"
              />
            </div>
          </div>

          {mode === "create" && (
            <Select
              label={t("team.form.fields.platformRole.label")}
              name="platformRole"
              helperText={t("team.form.fields.platformRole.helperText")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.platformRole}
            >
              {TEAM_MEMBER_PLATFORM_ROLES.map((role) => (
                <option key={role} value={role}>
                  {t(`admin.roleNames.${role}`)}
                </option>
              ))}
            </Select>
          )}

          {isInternalAdmin ? (
            <div className="mb-0">
              <span className="form-label d-block">
                {t("team.form.fields.permissions.label")}
              </span>

              <div className="d-flex flex-column gap-2">
                {grantableCapabilities.map((capability) => (
                  <Checkbox
                    key={capability}
                    id={`team-permission-${capability}`}
                    label={t(`admin.capabilityNames.${capability}`)}
                    checked={formik.values.permissions.includes(capability)}
                    onChange={() => toggleValue("permissions", capability)}
                  />
                ))}
              </div>

              {formik.touched.permissions && formik.errors.permissions && (
                <div className="text-danger fs-13 mt-1">
                  {String(formik.errors.permissions)}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted fs-13 mb-0">
              {t("team.form.fields.permissions.guideHint")}
            </p>
          )}
        </div>
      )}

      {activeStep === 1 && (
        <div>
          <div className="mb-3">
            <span className="form-label d-block">
              {t("team.form.fields.activityTypes.label")}
            </span>

            <div className="d-flex flex-wrap gap-3">
              {ACTIVITY_TYPES.map((activityType) => (
                <Checkbox
                  key={activityType.id}
                  id={`team-activity-${activityType.id}`}
                  label={t(`activityTypes.${activityType.id}`)}
                  checked={formik.values.activityTypeIds.includes(
                    activityType.id,
                  )}
                  onChange={() =>
                    toggleValue("activityTypeIds", activityType.id)
                  }
                />
              ))}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-6">
              <span className="form-label d-block">
                {t("team.form.fields.languages.label")}
              </span>

              <div className="d-flex flex-wrap gap-3">
                {TEAM_LANGUAGES.map((language) => (
                  <Checkbox
                    key={language}
                    id={`team-language-${language}`}
                    label={t(`events.languages.${language}`)}
                    checked={formik.values.languageIds.includes(language)}
                    onChange={() => toggleValue("languageIds", language)}
                  />
                ))}
              </div>
            </div>

            <div className="col-sm-6">
              <Input
                label={t("team.form.fields.experienceYears.label")}
                name="experienceYears"
                type="number"
                min="0"
                step="1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.experienceYears}
                error={
                  formik.touched.experienceYears
                    ? formik.errors.experienceYears
                    : undefined
                }
                containerClassName="mb-0"
              />
            </div>
          </div>

          <Textarea
            label={t("team.form.fields.bio.label")}
            name="bio"
            placeholder={t("team.form.fields.bio.placeholder")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bio}
            error={formik.touched.bio ? formik.errors.bio : undefined}
          />

          {currentCertificates.length > 0 && (
            <div className="mb-2">
              <div className="d-flex flex-wrap gap-2">
                {currentCertificates.map((certificate) => (
                  <a
                    key={certificate.id}
                    href={certificate.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={certificate.fileUrl}
                      alt=""
                      className="rounded border"
                      style={{ width: 56, height: 56, objectFit: "cover" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          <ImageUpload
            label={t("team.form.fields.certificates.label")}
            multiple
            compact
            value={formik.values.certificates}
            onChange={(files) => formik.setFieldValue("certificates", files)}
          />

          <div className="mt-3">
            <span className="form-label d-block">
              {t("team.form.fields.accountStatus.label")}
            </span>
            <Checkbox
              id="team-is-active"
              role="switch"
              containerClassName="form-check form-switch mb-0"
              label={t("team.form.fields.isActive.label")}
              checked={formik.values.isActive}
              onChange={(event) =>
                formik.setFieldValue("isActive", event.target.checked)
              }
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TeamMemberFormFields;
