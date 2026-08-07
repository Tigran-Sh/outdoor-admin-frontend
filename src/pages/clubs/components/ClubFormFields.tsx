import type { FormikProps } from "formik";
import { useTranslation } from "react-i18next";

import Checkbox from "@/components/ui/Checkbox/Checkbox";
import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import Textarea from "@/components/ui/Textarea/Textarea";

import { ACTIVITY_TYPES, CLUB_REGIONS, ENTITY_TYPES } from "../ClubsPage.data";
import type { ClubFormValues } from "../ClubProfile.schema";

interface ClubFormFieldsProps {
  formik: FormikProps<ClubFormValues>;
}

function ClubFormFields({ formik }: ClubFormFieldsProps) {
  const { t } = useTranslation();

  function toggleActivityType(value: string) {
    const current = formik.values.activityTypeIds;
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    formik.setFieldValue("activityTypeIds", next);
  }

  const requiresTaxId = formik.values.entityType === "soleTrader" || formik.values.entityType === "llc";
  const requiresOwnerId =
    formik.values.entityType === "individual" || formik.values.entityType === "informal";

  return (
    <>
      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">
          {t("clubs.form.steps.identity")}
        </h5>

        <Input
          label={t("clubs.form.fields.name.label")}
          name="name"
          placeholder={t("clubs.form.fields.name.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          error={formik.touched.name ? formik.errors.name : undefined}
        />

        <div className="row">
          <div className="col-sm-6">
            <ImageUpload
              label={t("clubs.form.fields.logo.label")}
              value={formik.values.logo}
              onChange={(files) => formik.setFieldValue("logo", files)}
              error={formik.touched.logo ? String(formik.errors.logo ?? "") : undefined}
            />
          </div>

          <div className="col-sm-6">
            <ImageUpload
              label={t("clubs.form.fields.coverImage.label")}
              value={formik.values.coverImage}
              onChange={(files) => formik.setFieldValue("coverImage", files)}
            />
          </div>
        </div>

        <Textarea
          label={t("clubs.form.fields.about.label")}
          name="about"
          placeholder={t("clubs.form.fields.about.placeholder")}
          helperText={t("clubs.form.fields.about.helperText")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.about}
          error={formik.touched.about ? formik.errors.about : undefined}
        />

        <div className="mb-3">
          <span className="form-label d-block">
            {t("clubs.form.fields.activityTypes.label")}
          </span>

          <div className="d-flex flex-wrap gap-3">
            {ACTIVITY_TYPES.map((activityType) => (
              <Checkbox
                key={activityType.id}
                id={`club-activity-${activityType.id}`}
                label={t(`activityTypes.${activityType.id}`)}
                checked={formik.values.activityTypeIds.includes(activityType.id)}
                onChange={() => toggleActivityType(activityType.id)}
              />
            ))}
          </div>

          {formik.touched.activityTypeIds && formik.errors.activityTypeIds && (
            <div className="text-danger fs-13 mt-1">
              {String(formik.errors.activityTypeIds)}
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-sm-6">
            <Select
              label={t("clubs.form.fields.baseRegion.label")}
              name="baseRegion"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.baseRegion}
              error={formik.touched.baseRegion ? formik.errors.baseRegion : undefined}
            >
              <option value="">{t("clubs.form.fields.baseRegion.placeholder")}</option>
              {CLUB_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {t(`regions.${region}`)}
                </option>
              ))}
            </Select>
          </div>

          <div className="col-sm-6">
            <Input
              label={t("clubs.form.fields.yearFounded.label")}
              name="yearFounded"
              type="number"
              min="1900"
              step="1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.yearFounded}
              error={formik.touched.yearFounded ? formik.errors.yearFounded : undefined}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <Input
              label={t("clubs.form.fields.email.label")}
              name="email"
              type="email"
              placeholder={t("clubs.form.fields.email.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email ? formik.errors.email : undefined}
            />
          </div>

          <div className="col-sm-6">
            <Input
              label={t("clubs.form.fields.phone.label")}
              name="phone"
              type="tel"
              placeholder={t("clubs.form.fields.phone.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              error={formik.touched.phone ? formik.errors.phone : undefined}
            />
          </div>
        </div>

        <div className="mb-3">
          <span className="form-label d-block">{t("clubs.form.fields.social.label")}</span>

          <div className="row">
            <div className="col-sm-4">
              <Input
                name="instagram"
                placeholder={t("clubs.form.fields.social.instagramPlaceholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.instagram}
                error={formik.touched.instagram ? formik.errors.instagram : undefined}
                containerClassName="mb-0"
              />
            </div>

            <div className="col-sm-4">
              <Input
                name="facebook"
                placeholder={t("clubs.form.fields.social.facebookPlaceholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.facebook}
                containerClassName="mb-0"
              />
            </div>

            <div className="col-sm-4">
              <Input
                name="telegram"
                placeholder={t("clubs.form.fields.social.telegramPlaceholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telegram}
                containerClassName="mb-0"
              />
            </div>
          </div>

          <div className="form-text">{t("clubs.form.fields.social.helperText")}</div>
        </div>

        <Input
          label={t("clubs.form.fields.website.label")}
          name="website"
          type="url"
          placeholder={t("clubs.form.fields.website.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.website}
          error={formik.touched.website ? formik.errors.website : undefined}
          containerClassName="mb-0"
        />
      </div>

      <hr className="my-4" />

      <div>
        <h5 className="fs-14 text-uppercase text-muted mb-3">{t("clubs.form.steps.legal")}</h5>

        <Select
          label={t("clubs.form.fields.entityType.label")}
          name="entityType"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.entityType}
          error={formik.touched.entityType ? formik.errors.entityType : undefined}
          helperText={t("clubs.form.fields.entityType.helperText")}
        >
          <option value="">{t("clubs.form.fields.entityType.placeholder")}</option>
          {ENTITY_TYPES.map((entityType) => (
            <option key={entityType} value={entityType}>
              {t(`clubs.entityTypes.${entityType}`)}
            </option>
          ))}
        </Select>

        {requiresTaxId && (
          <Input
            label={t("clubs.form.fields.taxId.label")}
            name="taxId"
            placeholder={t("clubs.form.fields.taxId.placeholder")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.taxId}
            error={formik.touched.taxId ? formik.errors.taxId : undefined}
          />
        )}

        {requiresOwnerId && (
          <ImageUpload
            label={t("clubs.form.fields.ownerIdDocument.label")}
            value={formik.values.ownerIdDocument}
            onChange={(files) => formik.setFieldValue("ownerIdDocument", files)}
            error={
              formik.touched.ownerIdDocument
                ? String(formik.errors.ownerIdDocument ?? "")
                : undefined
            }
          />
        )}
      </div>
    </>
  );
}

export default ClubFormFields;
