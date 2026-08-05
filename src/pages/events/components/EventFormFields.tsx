import type { FormikProps } from "formik";
import { useTranslation } from "react-i18next";

import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import Textarea from "@/components/ui/Textarea/Textarea";

import { EVENT_CATEGORIES, EVENT_GUIDES } from "../EventsPage.data";
import type { EventFormValues } from "../EventForm.schema";

interface EventFormFieldsProps {
  formik: FormikProps<EventFormValues>;
}

function EventFormFields({ formik }: EventFormFieldsProps) {
  const { t } = useTranslation();

  function toggleCategory(categoryId: string) {
    const current = formik.values.categoryIds;
    const next = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    formik.setFieldValue("categoryIds", next);
  }

  return (
    <>
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

        <Input
          label={t("events.form.fields.location.label")}
          name="location"
          placeholder={t("events.form.fields.location.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.location}
          error={formik.touched.location ? formik.errors.location : undefined}
          containerClassName="mb-0"
        />
      </div>

      <hr className="my-4" />

      <div className="mb-4">
        <h5 className="fs-14 text-uppercase text-muted mb-3">
          {t("events.form.steps.schedule")}
        </h5>

        <div className="row">
          <div className="col-sm-6">
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

          <div className="col-sm-6">
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
        </div>

        <Select
          label={t("events.form.fields.guide.label")}
          name="guideId"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.guideId}
          error={formik.touched.guideId ? formik.errors.guideId : undefined}
          containerClassName="mb-0"
        >
          <option value="">{t("events.form.fields.guide.placeholder")}</option>
          {EVENT_GUIDES.map((guide) => (
            <option key={guide.id} value={guide.id}>
              {guide.name}
            </option>
          ))}
        </Select>
      </div>

      <hr className="my-4" />

      <div>
        <h5 className="fs-14 text-uppercase text-muted mb-3">{t("events.form.steps.details")}</h5>

        <div className="mb-3">
          <span className="form-label d-block">{t("events.form.fields.categories.label")}</span>

          <div className="d-flex flex-wrap gap-3">
            {EVENT_CATEGORIES.map((category) => (
              <Checkbox
                key={category.id}
                id={`event-category-${category.id}`}
                label={t(`events.categories.${category.id}`)}
                checked={formik.values.categoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
            ))}
          </div>

          {formik.touched.categoryIds && formik.errors.categoryIds && (
            <div className="text-danger fs-13 mt-1">{String(formik.errors.categoryIds)}</div>
          )}
        </div>

        <Textarea
          label={t("events.form.fields.description.label")}
          name="description"
          placeholder={t("events.form.fields.description.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          error={formik.touched.description ? formik.errors.description : undefined}
          containerClassName="mb-0"
        />
      </div>
    </>
  );
}

export default EventFormFields;
