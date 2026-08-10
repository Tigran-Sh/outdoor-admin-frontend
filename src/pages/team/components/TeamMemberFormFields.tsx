import type { FormikProps } from "formik";
import { useTranslation } from "react-i18next";

import Checkbox from "@/components/ui/Checkbox/Checkbox";
import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import Textarea from "@/components/ui/Textarea/Textarea";

import { formatEventDate } from "../../events/EventsPage.data";
import {
  ACTIVITY_TYPES,
  TEAM_EVENTS,
  TEAM_LANGUAGES,
  TEAM_PERMISSIONS,
  TEAM_ROLES,
} from "../TeamPage.data";
import type { TeamMemberFormValues } from "../TeamMember.schema";

interface TeamMemberFormFieldsProps {
  formik: FormikProps<TeamMemberFormValues>;
  activeStep: number;
}

function TeamMemberFormFields({ formik, activeStep }: TeamMemberFormFieldsProps) {
  const { t } = useTranslation();

  function toggleValue(
    field: "permissionIds" | "activityTypeIds" | "languageIds" | "assignedEventIds",
    value: string,
  ) {
    const current = formik.values[field];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    formik.setFieldValue(field, next);
  }

  return (
    <>
      {activeStep === 0 && (
      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">{t("team.form.steps.basic")}</h5>

        <div className="row">
          <div className="col-sm-6">
            <Input
              label={t("team.form.fields.firstName.label")}
              name="firstName"
              placeholder={t("team.form.fields.firstName.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              error={formik.touched.firstName ? formik.errors.firstName : undefined}
            />
          </div>

          <div className="col-sm-6">
            <Input
              label={t("team.form.fields.lastName.label")}
              name="lastName"
              placeholder={t("team.form.fields.lastName.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              error={formik.touched.lastName ? formik.errors.lastName : undefined}
            />
          </div>
        </div>

        <ImageUpload
          label={t("team.form.fields.photo.label")}
          value={formik.values.photo}
          onChange={(files) => formik.setFieldValue("photo", files)}
        />

        <div className="row">
          <div className="col-sm-6">
            <Input
              label={t("team.form.fields.phone.label")}
              name="phone"
              type="tel"
              placeholder={t("team.form.fields.phone.placeholder")}
              helperText={t("team.form.fields.phone.helperText")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              error={formik.touched.phone ? formik.errors.phone : undefined}
            />
          </div>

          <div className="col-sm-6">
            <Input
              label={t("team.form.fields.email.label")}
              name="email"
              type="email"
              placeholder={t("team.form.fields.email.placeholder")}
              helperText={t("team.form.fields.email.helperText")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email ? formik.errors.email : undefined}
            />
          </div>
        </div>

        <Input
          label={t("team.form.fields.birthDate.label")}
          name="birthDate"
          type="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.birthDate}
          error={formik.touched.birthDate ? formik.errors.birthDate : undefined}
          containerClassName="mb-0"
        />
      </div>
      )}

      {activeStep === 1 && (
      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">
          {t("team.form.steps.roleAndPermissions")}
        </h5>

        <Select
          label={t("team.form.fields.role.label")}
          name="role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.role}
          error={formik.touched.role ? formik.errors.role : undefined}
        >
          <option value="">{t("team.form.fields.role.placeholder")}</option>
          {TEAM_ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              {t(`team.roles.${role.id}`)}
            </option>
          ))}
        </Select>

        <div className="mb-0">
          <span className="form-label d-block">{t("team.form.fields.permissions.label")}</span>

          <div className="d-flex flex-column gap-2">
            {TEAM_PERMISSIONS.map((permission) => (
              <Checkbox
                key={permission}
                id={`team-permission-${permission}`}
                label={t(`team.permissions.${permission}`)}
                checked={formik.values.permissionIds.includes(permission)}
                onChange={() => toggleValue("permissionIds", permission)}
              />
            ))}
          </div>
        </div>
      </div>
      )}

      {activeStep === 2 && (
      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">
          {t("team.form.steps.specialization")}
        </h5>

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
                checked={formik.values.activityTypeIds.includes(activityType.id)}
                onChange={() => toggleValue("activityTypeIds", activityType.id)}
              />
            ))}
          </div>

          {formik.touched.activityTypeIds && formik.errors.activityTypeIds && (
            <div className="text-danger fs-13 mt-1">
              {String(formik.errors.activityTypeIds)}
            </div>
          )}
        </div>

        <div className="mb-3">
          <span className="form-label d-block">{t("team.form.fields.languages.label")}</span>

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

          {formik.touched.languageIds && formik.errors.languageIds && (
            <div className="text-danger fs-13 mt-1">{String(formik.errors.languageIds)}</div>
          )}
        </div>

        <div className="row">
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
                formik.touched.experienceYears ? formik.errors.experienceYears : undefined
              }
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

        <ImageUpload
          label={t("team.form.fields.certificates.label")}
          multiple
          value={formik.values.certificates}
          onChange={(files) => formik.setFieldValue("certificates", files)}
        />
      </div>
      )}

      {activeStep === 3 && (
      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">{t("team.form.steps.events")}</h5>

        <Select
          label={t("team.form.fields.assignedEvents.label")}
          name="assignedEventIds"
          multiple
          size="lg"
          value={formik.values.assignedEventIds}
          onChange={(event) => {
            const selected = Array.from(event.target.selectedOptions, (option) => option.value);
            formik.setFieldValue("assignedEventIds", selected);
          }}
          onBlur={formik.handleBlur}
          error={
            formik.touched.assignedEventIds ? String(formik.errors.assignedEventIds ?? "") : undefined
          }
          containerClassName="mb-0"
        >
          {TEAM_EVENTS.map((event) => (
            <option key={event.id} value={event.id}>
              {`${event.name} — ${formatEventDate(event.date, event.time)}`}
            </option>
          ))}
        </Select>
      </div>
      )}

      {activeStep === 4 && (
      <div>
        <h5 className="fs-14 text-uppercase text-muted mb-3">{t("team.form.steps.status")}</h5>

        <Checkbox
          id="team-is-active"
          role="switch"
          containerClassName="form-check form-switch mb-0"
          label={t("team.form.fields.isActive.label")}
          checked={formik.values.isActive}
          onChange={(event) => formik.setFieldValue("isActive", event.target.checked)}
        />
      </div>
      )}
    </>
  );
}

export default TeamMemberFormFields;
