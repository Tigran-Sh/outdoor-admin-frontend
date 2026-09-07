import * as Yup from "yup";
import type { TFunction } from "i18next";

import type { FormWizardStep } from "@/hooks/useFormWizard";
import type { ClubFormValues } from "@/types/club";

export type { ClubFormValues };
export { initialClubFormValues, clubToFormValues, buildClubFormData } from "@/types/club";

export function getClubFormSteps(t: TFunction): FormWizardStep<ClubFormValues>[] {
  return [
    {
      id: "general",
      label: t("clubs.form.steps.general"),
      fields: ["name", "about"],
    },
    {
      id: "media",
      label: t("clubs.form.steps.media"),
      fields: ["logo", "coverImage"],
    },
    {
      id: "activity",
      label: t("clubs.form.steps.activity"),
      fields: ["activityTypeIds", "baseRegion", "yearFounded"],
    },
    {
      id: "contact",
      label: t("clubs.form.steps.contact"),
      fields: ["email", "phone", "instagram", "facebook", "telegram", "website"],
    },
    {
      id: "legal",
      label: t("clubs.form.steps.legal"),
      fields: ["entityType", "taxId", "ownerIdDocument"],
    },
  ];
}

const ABOUT_MIN_LENGTH = 50;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];

function fileSizeTest(t: TFunction) {
  return Yup.array()
    .of(Yup.mixed<File>())
    .test(
      "file-size",
      t("clubs.form.validation.fileTooLarge"),
      (files) => !files?.[0] || files[0].size <= MAX_IMAGE_SIZE,
    );
}

/**
 * The backend validates the *resulting* club record across many partial
 * saves (see docs/club-fields.md), so this schema mirrors that: only
 * `name` is unconditionally required, and the rest only apply their rule
 * once the relevant value is actually set/touched.
 */
export function getClubFormSchema(
  t: TFunction,
  options: { hasOwnerIdDocument?: boolean } = {},
) {
  return Yup.object({
    name: Yup.string().required(t("clubs.form.validation.nameRequired")),
    logo: fileSizeTest(t).test(
      "file-type",
      t("clubs.form.validation.imageTypeInvalid"),
      (files) => !files?.[0] || IMAGE_TYPES.includes(files[0].type),
    ),
    coverImage: fileSizeTest(t).test(
      "file-type",
      t("clubs.form.validation.imageTypeInvalid"),
      (files) => !files?.[0] || IMAGE_TYPES.includes(files[0].type),
    ),
    about: Yup.string().test(
      "about-min-length",
      t("clubs.form.validation.aboutTooShort", { min: ABOUT_MIN_LENGTH }),
      (value) => !value || value.trim().length >= ABOUT_MIN_LENGTH,
    ),
    activityTypeIds: Yup.array()
      .of(Yup.string().required())
      .min(1, t("clubs.form.validation.activityTypesRequired")),
    baseRegion: Yup.string(),
    yearFounded: Yup.number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError(t("clubs.form.validation.yearFoundedInvalid"))
      .integer(t("clubs.form.validation.yearFoundedInvalid"))
      .min(1900, t("clubs.form.validation.yearFoundedInvalid"))
      .max(new Date().getFullYear(), t("clubs.form.validation.yearFoundedInvalid")),
    email: Yup.string().email(t("clubs.form.validation.emailInvalid")),
    phone: Yup.string(),
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
    entityType: Yup.string(),
    taxId: Yup.string().when("entityType", {
      is: (entityType: string) => entityType === "soleTrader" || entityType === "llc",
      then: (schema) => schema.required(t("clubs.form.validation.taxIdRequired")),
    }),
    ownerIdDocument: Yup.array()
      .of(Yup.mixed<File>())
      .test(
        "file-size",
        t("clubs.form.validation.fileTooLarge"),
        (files) => !files?.[0] || files[0].size <= MAX_IMAGE_SIZE,
      )
      .test(
        "file-type",
        t("clubs.form.validation.documentTypeInvalid"),
        (files) => !files?.[0] || DOCUMENT_TYPES.includes(files[0].type),
      )
      .when("entityType", {
        is: (entityType: string) => entityType === "individual" || entityType === "informal",
        then: (schema) =>
          schema.test(
            "owner-id-required",
            t("clubs.form.validation.ownerIdDocumentRequired"),
            (files) => Boolean(files?.[0]) || Boolean(options.hasOwnerIdDocument),
          ),
      }),
  });
}
