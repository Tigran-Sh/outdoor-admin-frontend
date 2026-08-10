import type { FormikProps } from "formik";
import { useTranslation } from "react-i18next";

import Checkbox from "@/components/ui/Checkbox/Checkbox";
import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import Textarea from "@/components/ui/Textarea/Textarea";

import {
  EVENT_CATEGORIES,
  EVENT_DIFFICULTIES,
  EVENT_DURATION_TYPES,
  EVENT_GUIDES,
  EVENT_LANGUAGES,
  EVENT_PRICE_TYPES,
  EVENT_REGIONS,
} from "../EventsPage.data";
import type { EventFormValues } from "../EventForm.schema";

interface EventFormFieldsProps {
  formik: FormikProps<EventFormValues>;
  activeStep: number;
}

function EventFormFields({ formik, activeStep }: EventFormFieldsProps) {
  const { t } = useTranslation();

  function toggleValue(field: "languageIds" | "difficultyIds", value: string) {
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
        <h5 className="fs-14 text-uppercase text-muted mb-3">
          {t("events.form.steps.general")}
        </h5>

        <Input
          label={t("events.form.fields.name.label")}
          name="name"
          placeholder={t("events.form.fields.name.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          error={formik.touched.name ? formik.errors.name : undefined}
        />

        <Textarea
          label={t("events.form.fields.description.label")}
          name="description"
          placeholder={t("events.form.fields.description.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          error={formik.touched.description ? formik.errors.description : undefined}
        />

        <div className="row">
          <div className="col-sm-6">
            <Select
              label={t("events.form.fields.category.label")}
              name="category"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.category}
              error={formik.touched.category ? formik.errors.category : undefined}
              containerClassName="mb-0"
            >
              <option value="">{t("events.form.fields.category.placeholder")}</option>
              {EVENT_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {t(`activityTypes.${category.id}`)}
                </option>
              ))}
            </Select>
          </div>

          <div className="col-sm-6">
            <Select
              label={t("events.form.fields.region.label")}
              name="region"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.region}
              error={formik.touched.region ? formik.errors.region : undefined}
              containerClassName="mb-0"
            >
              <option value="">{t("events.form.fields.region.placeholder")}</option>
              {EVENT_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {t(`regions.${region}`)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      )}

      {activeStep === 1 && (
      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">{t("events.form.steps.media")}</h5>

        <div className="row">
          <div className="col-sm-6">
            <ImageUpload
              label={t("events.form.fields.coverImage.label")}
              value={formik.values.coverImage}
              onChange={(files) => formik.setFieldValue("coverImage", files)}
            />
          </div>

          <div className="col-sm-6">
            <ImageUpload
              label={t("events.form.fields.galleryImages.label")}
              multiple
              value={formik.values.galleryImages}
              onChange={(files) => formik.setFieldValue("galleryImages", files)}
            />
          </div>
        </div>
      </div>
      )}

      {activeStep === 2 && (
      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">
          {t("events.form.steps.schedule")}
        </h5>

        <div className="row">
          <div className="col-sm-4">
            <Input
              label={t("events.form.fields.date.label")}
              name="date"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date}
              error={formik.touched.date ? formik.errors.date : undefined}
            />
          </div>

          <div className="col-sm-4">
            <Input
              label={t("events.form.fields.time.label")}
              name="time"
              type="time"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.time}
              error={formik.touched.time ? formik.errors.time : undefined}
            />
          </div>

          <div className="col-sm-4">
            <Select
              label={t("events.form.fields.durationType.label")}
              name="durationType"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.durationType}
              error={formik.touched.durationType ? formik.errors.durationType : undefined}
            >
              {EVENT_DURATION_TYPES.map((durationType) => (
                <option key={durationType} value={durationType}>
                  {t(`events.durationTypes.${durationType}`)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {formik.values.durationType === "multi" && (
          <Input
            label={t("events.form.fields.endDate.label")}
            name="endDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endDate}
            error={formik.touched.endDate ? formik.errors.endDate : undefined}
          />
        )}

        <div className="mb-3">
          <span className="form-label d-block">{t("events.form.fields.languages.label")}</span>

          <div className="d-flex flex-wrap gap-3">
            {EVENT_LANGUAGES.map((language) => (
              <Checkbox
                key={language}
                id={`event-language-${language}`}
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
            <Select
              label={t("events.form.fields.guide.label")}
              name="guideId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.guideId}
              error={formik.touched.guideId ? formik.errors.guideId : undefined}
            >
              <option value="">{t("events.form.fields.guide.placeholder")}</option>
              {EVENT_GUIDES.map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="col-sm-6">
            <Select
              label={t("events.form.fields.sweepGuide.label")}
              name="sweepGuideId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sweepGuideId}
              error={formik.touched.sweepGuideId ? formik.errors.sweepGuideId : undefined}
              helperText={t("events.form.fields.sweepGuide.helperText")}
              containerClassName="mb-0"
            >
              <option value="">{t("events.form.fields.sweepGuide.placeholder")}</option>
              {EVENT_GUIDES.map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      )}

      {activeStep === 3 && (
      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">{t("events.form.steps.route")}</h5>

        <div className="mb-3">
          <span className="form-label d-block">{t("events.form.fields.difficulties.label")}</span>

          <div className="d-flex flex-wrap gap-3">
            {EVENT_DIFFICULTIES.map((difficulty) => (
              <Checkbox
                key={difficulty}
                id={`event-difficulty-${difficulty}`}
                label={t(`events.difficulties.${difficulty}`)}
                checked={formik.values.difficultyIds.includes(difficulty)}
                onChange={() => toggleValue("difficultyIds", difficulty)}
              />
            ))}
          </div>

          {formik.touched.difficultyIds && formik.errors.difficultyIds && (
            <div className="text-danger fs-13 mt-1">{String(formik.errors.difficultyIds)}</div>
          )}
        </div>

        <div className="row">
          <div className="col-sm-6">
            <Input
              label={t("events.form.fields.distanceKm.label")}
              name="distanceKm"
              type="number"
              min="0"
              step="0.1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.distanceKm}
              error={formik.touched.distanceKm ? formik.errors.distanceKm : undefined}
            />
          </div>

          <div className="col-sm-6">
            <Input
              label={t("events.form.fields.elevationGainM.label")}
              name="elevationGainM"
              type="number"
              min="0"
              step="1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.elevationGainM}
              error={formik.touched.elevationGainM ? formik.errors.elevationGainM : undefined}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <Input
              label={t("events.form.fields.meetingPointDescription.label")}
              name="meetingPointDescription"
              placeholder={t("events.form.fields.meetingPointDescription.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.meetingPointDescription}
              error={
                formik.touched.meetingPointDescription
                  ? formik.errors.meetingPointDescription
                  : undefined
              }
            />
          </div>

          <div className="col-sm-6">
            <Input
              label={t("events.form.fields.meetingPointCoordinates.label")}
              name="meetingPointCoordinates"
              placeholder={t("events.form.fields.meetingPointCoordinates.placeholder")}
              helperText={t("events.form.fields.meetingPointCoordinates.helperText")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.meetingPointCoordinates}
              error={
                formik.touched.meetingPointCoordinates
                  ? formik.errors.meetingPointCoordinates
                  : undefined
              }
              containerClassName="mb-0"
            />
          </div>
        </div>
      </div>
      )}

      {activeStep === 4 && (
      <div>
        <h5 className="fs-14 text-uppercase text-muted mb-3">
          {t("events.form.steps.salesTerms")}
        </h5>

        <div className="row">
          <div className="col-sm-6">
            <Input
              label={t("events.form.fields.maxParticipants.label")}
              name="maxParticipants"
              type="number"
              min="1"
              step="1"
              placeholder={t("events.form.fields.maxParticipants.placeholder")}
              helperText={t("events.form.fields.maxParticipants.helperText")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.maxParticipants}
              error={formik.touched.maxParticipants ? formik.errors.maxParticipants : undefined}
            />
          </div>

          <div className="col-sm-6">
            <Select
              label={t("events.form.fields.priceType.label")}
              name="priceType"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.priceType}
              error={formik.touched.priceType ? formik.errors.priceType : undefined}
            >
              <option value="">{t("events.form.fields.priceType.placeholder")}</option>
              {EVENT_PRICE_TYPES.map((priceType) => (
                <option key={priceType} value={priceType}>
                  {t(`events.priceTypes.${priceType}`)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4">
            <Input
              label={t("events.form.fields.price.label")}
              name="price"
              type="number"
              min="0"
              step="1"
              disabled={formik.values.priceType === "free"}
              helperText={t("events.form.fields.price.helperText")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
              error={formik.touched.price ? formik.errors.price : undefined}
            />
          </div>

          <div className="col-sm-8">
            <Textarea
              label={t("events.form.fields.additionalInfo.label")}
              name="additionalInfo"
              placeholder={t("events.form.fields.additionalInfo.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.additionalInfo}
              error={formik.touched.additionalInfo ? formik.errors.additionalInfo : undefined}
              containerClassName="mb-0"
            />
          </div>
        </div>

        <Textarea
          label={t("events.form.fields.whatIsNecessary.label")}
          name="whatIsNecessary"
          placeholder={t("events.form.fields.whatIsNecessary.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.whatIsNecessary}
          error={formik.touched.whatIsNecessary ? formik.errors.whatIsNecessary : undefined}
        />

        <div className="row">
          <div className="col-sm-6">
            <Textarea
              label={t("events.form.fields.includedItems.label")}
              name="includedItems"
              placeholder={t("events.form.fields.includedItems.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.includedItems}
              error={formik.touched.includedItems ? formik.errors.includedItems : undefined}
            />
          </div>

          <div className="col-sm-6">
            <Textarea
              label={t("events.form.fields.excludedItems.label")}
              name="excludedItems"
              placeholder={t("events.form.fields.excludedItems.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.excludedItems}
              error={formik.touched.excludedItems ? formik.errors.excludedItems : undefined}
              containerClassName="mb-0"
            />
          </div>
        </div>

        <Textarea
          label={t("events.form.fields.cancellationPolicy.label")}
          name="cancellationPolicy"
          placeholder={t("events.form.fields.cancellationPolicy.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.cancellationPolicy}
          error={formik.touched.cancellationPolicy ? formik.errors.cancellationPolicy : undefined}
          containerClassName="mb-0"
        />
      </div>
      )}
    </>
  );
}

export default EventFormFields;
