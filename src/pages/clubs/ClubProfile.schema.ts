import * as Yup from "yup";
import type { TFunction } from "i18next";

export interface ClubFormValues {
  name: string;
  logo: File[];
  coverImage: File[];
  about: string;
  activityTypeIds: string[];
  baseRegion: string;
  yearFounded: string;
  email: string;
  phone: string;
  instagram: string;
  facebook: string;
  telegram: string;
  website: string;
  entityType: string;
  taxId: string;
  ownerIdDocument: File[];
}

export const initialClubFormValues: ClubFormValues = {
  name: "",
  logo: [],
  coverImage: [],
  about: "",
  activityTypeIds: [],
  baseRegion: "",
  yearFounded: "",
  email: "",
  phone: "",
  instagram: "",
  facebook: "",
  telegram: "",
  website: "",
  entityType: "",
  taxId: "",
  ownerIdDocument: [],
};

const ABOUT_MIN_LENGTH = 50;

export function getClubFormSchema(t: TFunction) {
  return Yup.object({
    name: Yup.string().required(t("clubs.form.validation.nameRequired")),
    logo: Yup.array().min(1, t("clubs.form.validation.logoRequired")),
    coverImage: Yup.array(),
    about: Yup.string()
      .min(ABOUT_MIN_LENGTH, t("clubs.form.validation.aboutTooShort", { min: ABOUT_MIN_LENGTH }))
      .required(t("clubs.form.validation.aboutRequired")),
    activityTypeIds: Yup.array()
      .of(Yup.string().required())
      .min(1, t("clubs.form.validation.activityTypesRequired")),
    baseRegion: Yup.string().required(t("clubs.form.validation.baseRegionRequired")),
    yearFounded: Yup.number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError(t("clubs.form.validation.yearFoundedInvalid"))
      .integer(t("clubs.form.validation.yearFoundedInvalid"))
      .min(1900, t("clubs.form.validation.yearFoundedInvalid"))
      .max(new Date().getFullYear(), t("clubs.form.validation.yearFoundedInvalid")),
    email: Yup.string()
      .email(t("clubs.form.validation.emailInvalid"))
      .required(t("clubs.form.validation.emailRequired")),
    phone: Yup.string().required(t("clubs.form.validation.phoneRequired")),
    instagram: Yup.string().test(
      "at-least-one-social",
      t("clubs.form.validation.socialRequired"),
      function atLeastOneSocial(value) {
        return Boolean(value || this.parent.facebook || this.parent.telegram);
      },
    ),
    facebook: Yup.string(),
    telegram: Yup.string(),
    website: Yup.string().url(t("clubs.form.validation.websiteInvalid")),
    entityType: Yup.string().required(t("clubs.form.validation.entityTypeRequired")),
    taxId: Yup.string().when("entityType", {
      is: (entityType: string) => entityType === "soleTrader" || entityType === "llc",
      then: (schema) => schema.required(t("clubs.form.validation.taxIdRequired")),
    }),
    ownerIdDocument: Yup.array().when("entityType", {
      is: (entityType: string) => entityType === "individual" || entityType === "informal",
      then: (schema) => schema.min(1, t("clubs.form.validation.ownerIdDocumentRequired")),
    }),
  });
}
