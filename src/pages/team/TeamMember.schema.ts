import * as Yup from "yup";
import type { TFunction } from "i18next";

import type { FormWizardStep } from "@/hooks/useFormWizard";
import { ApiError } from "@/types/apiError";
import type { TeamMemberFormMode, TeamMemberFormValues } from "@/types/teamMember";
import { getDateStringYearsAgo, getTodayDateString } from "@/utils/date";

/** Team members (guides/admins) must be at least this old. */
export const MIN_TEAM_MEMBER_AGE = 18;

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
    birthDate: Yup.string()
      .test(
        "not-future",
        t("team.form.validation.birthDateFuture"),
        (value) => !value || value <= getTodayDateString(),
      )
      .test(
        "min-age",
        t("team.form.validation.birthDateTooYoung", { minAge: MIN_TEAM_MEMBER_AGE }),
        (value) => !value || value <= getDateStringYearsAgo(MIN_TEAM_MEMBER_AGE),
      ),
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

/**
 * Maps each form field to the backend serializer field name used in
 * `ApiError.details` (e.g. `fullName` -> `full_name`), so a validation error
 * such as "this email is already in use" can be attached back to the right
 * form field instead of only surfacing as a generic message.
 */
const TEAM_MEMBER_API_FIELD_ENTRIES: [keyof TeamMemberFormValues, string][] = [
  ["fullName", "full_name"],
  ["email", "email"],
  ["password", "password"],
  ["platformRole", "platform_role"],
  ["permissions", "permissions"],
  ["activityTypeIds", "activity_types"],
  ["languageIds", "languages"],
  ["phone", "phone"],
  ["birthDate", "birth_date"],
  ["experienceYears", "experience_years"],
  ["bio", "bio"],
  ["photo", "photo"],
  ["isActive", "is_active"],
];

/** Extracts per-field messages (e.g. a duplicate email) from an API error. */
export function mapTeamMemberApiFieldErrors(
  error: ApiError,
): Partial<Record<keyof TeamMemberFormValues, string>> {
  const fieldErrors: Partial<Record<keyof TeamMemberFormValues, string>> = {};
  for (const [field, apiField] of TEAM_MEMBER_API_FIELD_ENTRIES) {
    const message = error.fieldError(apiField);
    if (message) fieldErrors[field] = message;
  }
  return fieldErrors;
}
