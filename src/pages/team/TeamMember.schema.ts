import * as Yup from "yup";
import type { TFunction } from "i18next";

import type { FormWizardStep } from "@/hooks/useFormWizard";
import type { TeamMemberFormMode, TeamMemberFormValues } from "@/types/teamMember";

export type { TeamMemberFormValues, TeamMemberFormMode };
export {
  initialTeamMemberFormValues,
  teamMemberToFormValues,
  buildTeamMemberFormData,
} from "@/types/teamMember";

export function getTeamMemberFormSteps(
  t: TFunction,
  mode: TeamMemberFormMode,
): FormWizardStep<TeamMemberFormValues>[] {
  return [
    {
      id: "basic",
      label: t("team.form.steps.basic"),
      fields:
        mode === "create"
          ? [
              "fullName",
              "email",
              "password",
              "photo",
              "phone",
              "birthDate",
              "platformRole",
              "permissions",
            ]
          : ["fullName", "email", "photo", "phone", "birthDate", "permissions"],
    },
    {
      id: "specialization",
      label: t("team.form.steps.specialization"),
      fields: [
        "activityTypeIds",
        "languageIds",
        "experienceYears",
        "bio",
        "certificates",
        "isActive",
      ],
    },
  ];
}

/**
 * `platformRole` is only ever chosen at creation (the backend does not allow
 * changing it afterwards), and `permissions` only applies to the
 * `internal_admin` platform role -- a `guide` uses its fixed role defaults
 * and the backend rejects any custom permissions submitted for it.
 */
export function getTeamMemberFormSchema(t: TFunction, mode: TeamMemberFormMode) {
  return Yup.object({
    fullName: Yup.string().required(t("team.form.validation.fullNameRequired")),
    email: Yup.string()
      .email(t("team.form.validation.emailInvalid"))
      .required(t("team.form.validation.emailRequired")),
    password:
      mode === "create"
        ? Yup.string()
            .min(8, t("team.form.validation.passwordTooShort"))
            .required(t("team.form.validation.passwordRequired"))
        : Yup.string(),
    platformRole: Yup.string(),
    permissions: Yup.array()
      .of(Yup.string().required())
      .when("platformRole", {
        is: "internal_admin",
        then: (schema) => schema.min(1, t("team.form.validation.permissionsRequired")),
      }),
    activityTypeIds: Yup.array().of(Yup.string().required()),
    languageIds: Yup.array().of(Yup.string().required()),
    phone: Yup.string(),
    birthDate: Yup.string(),
    experienceYears: Yup.number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError(t("team.form.validation.experienceYearsInvalid"))
      .min(0, t("team.form.validation.experienceYearsInvalid")),
    bio: Yup.string(),
    photo: Yup.array(),
    certificates: Yup.array(),
    isActive: Yup.boolean().required(),
  });
}
