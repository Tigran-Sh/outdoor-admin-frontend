import * as Yup from "yup";
import type { TFunction } from "i18next";

export interface EventFormValues {
  name: string;
  location: string;
  description: string;
  date: string;
  time: string;
  guideId: string;
  categoryIds: string[];
}

export const initialEventFormValues: EventFormValues = {
  name: "",
  location: "",
  description: "",
  date: "",
  time: "",
  guideId: "",
  categoryIds: [],
};

export function getEventFormSchema(t: TFunction) {
  return Yup.object({
    name: Yup.string().required(t("events.form.validation.nameRequired")),
    location: Yup.string().required(t("events.form.validation.locationRequired")),
    description: Yup.string(),
    date: Yup.string().required(t("events.form.validation.dateRequired")),
    time: Yup.string().required(t("events.form.validation.timeRequired")),
    guideId: Yup.string().required(t("events.form.validation.guideRequired")),
    categoryIds: Yup.array()
      .of(Yup.string().required())
      .min(1, t("events.form.validation.categoriesRequired")),
  });
}
