import * as Yup from "yup";
import type { TFunction } from "i18next";

export interface EventFormValues {
  name: string;
  category: string;
  region: string;
  description: string;
  date: string;
  time: string;
  durationType: string;
  endDate: string;
  guideId: string;
  sweepGuideId: string;
  languageIds: string[];
  difficultyIds: string[];
  distanceKm: string;
  elevationGainM: string;
  meetingPointDescription: string;
  meetingPointCoordinates: string;
  maxParticipants: string;
  priceType: string;
  price: string;
  whatIsNecessary: string;
  includedItems: string;
  excludedItems: string;
  cancellationPolicy: string;
  additionalInfo: string;
  coverImage: File[];
  galleryImages: File[];
}

export const initialEventFormValues: EventFormValues = {
  name: "",
  category: "",
  region: "",
  description: "",
  date: "",
  time: "",
  durationType: "single",
  endDate: "",
  guideId: "",
  sweepGuideId: "",
  languageIds: [],
  difficultyIds: [],
  distanceKm: "",
  elevationGainM: "",
  meetingPointDescription: "",
  meetingPointCoordinates: "",
  maxParticipants: "",
  priceType: "",
  price: "",
  whatIsNecessary: "",
  includedItems: "",
  excludedItems: "",
  cancellationPolicy: "",
  additionalInfo: "",
  coverImage: [],
  galleryImages: [],
};

export function getEventFormSchema(t: TFunction) {
  return Yup.object({
    name: Yup.string().required(t("events.form.validation.nameRequired")),
    category: Yup.string().required(t("events.form.validation.categoryRequired")),
    region: Yup.string().required(t("events.form.validation.regionRequired")),
    description: Yup.string(),
    date: Yup.string().required(t("events.form.validation.dateRequired")),
    time: Yup.string().required(t("events.form.validation.timeRequired")),
    durationType: Yup.string().required(),
    endDate: Yup.string().when("durationType", {
      is: "multi",
      then: (schema) => schema.required(t("events.form.validation.endDateRequired")),
    }),
    guideId: Yup.string().required(t("events.form.validation.guideRequired")),
    sweepGuideId: Yup.string(),
    languageIds: Yup.array()
      .of(Yup.string().required())
      .min(1, t("events.form.validation.languagesRequired")),
    difficultyIds: Yup.array()
      .of(Yup.string().required())
      .min(1, t("events.form.validation.difficultiesRequired")),
    distanceKm: Yup.number()
      .typeError(t("events.form.validation.distanceInvalid"))
      .positive(t("events.form.validation.distanceInvalid"))
      .required(t("events.form.validation.distanceRequired")),
    elevationGainM: Yup.number()
      .typeError(t("events.form.validation.elevationInvalid"))
      .min(0, t("events.form.validation.elevationInvalid"))
      .required(t("events.form.validation.elevationRequired")),
    meetingPointDescription: Yup.string().required(
      t("events.form.validation.meetingPointDescriptionRequired"),
    ),
    meetingPointCoordinates: Yup.string().required(
      t("events.form.validation.coordinatesRequired"),
    ),
    maxParticipants: Yup.number()
      .typeError(t("events.form.validation.maxParticipantsInvalid"))
      .integer(t("events.form.validation.maxParticipantsInvalid"))
      .positive(t("events.form.validation.maxParticipantsInvalid"))
      .required(t("events.form.validation.maxParticipantsRequired")),
    priceType: Yup.string().required(t("events.form.validation.priceTypeRequired")),
    price: Yup.number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError(t("events.form.validation.priceInvalid"))
      .min(0, t("events.form.validation.priceInvalid"))
      .when("priceType", {
        is: "paid",
        then: (schema) => schema.required(t("events.form.validation.priceRequired")),
      }),
    whatIsNecessary: Yup.string(),
    includedItems: Yup.string(),
    excludedItems: Yup.string(),
    cancellationPolicy: Yup.string(),
    additionalInfo: Yup.string(),
    coverImage: Yup.array(),
    galleryImages: Yup.array(),
  });
}
