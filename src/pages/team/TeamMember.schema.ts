import * as Yup from "yup";
import type { TFunction } from "i18next";

export interface TeamMemberFormValues {
  firstName: string;
  lastName: string;
  photo: File[];
  phone: string;
  email: string;
  birthDate: string;
  role: string;
  permissionIds: string[];
  activityTypeIds: string[];
  languageIds: string[];
  experienceYears: string;
  bio: string;
  certificates: File[];
  assignedEventIds: string[];
  isActive: boolean;
}

export const initialTeamMemberFormValues: TeamMemberFormValues = {
  firstName: "",
  lastName: "",
  photo: [],
  phone: "",
  email: "",
  birthDate: "",
  role: "",
  permissionIds: [],
  activityTypeIds: [],
  languageIds: [],
  experienceYears: "",
  bio: "",
  certificates: [],
  assignedEventIds: [],
  isActive: true,
};

export function getTeamMemberFormSchema(t: TFunction) {
  return Yup.object({
    firstName: Yup.string().required(t("team.form.validation.firstNameRequired")),
    lastName: Yup.string().required(t("team.form.validation.lastNameRequired")),
    photo: Yup.array(),
    phone: Yup.string().required(t("team.form.validation.phoneRequired")),
    email: Yup.string().email(t("team.form.validation.emailInvalid")),
    birthDate: Yup.string(),
    role: Yup.string().required(t("team.form.validation.roleRequired")),
    permissionIds: Yup.array().of(Yup.string().required()),
    activityTypeIds: Yup.array()
      .of(Yup.string().required())
      .min(1, t("team.form.validation.activityTypesRequired")),
    languageIds: Yup.array()
      .of(Yup.string().required())
      .min(1, t("team.form.validation.languagesRequired")),
    experienceYears: Yup.number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError(t("team.form.validation.experienceYearsInvalid"))
      .min(0, t("team.form.validation.experienceYearsInvalid")),
    bio: Yup.string(),
    certificates: Yup.array(),
    assignedEventIds: Yup.array().of(Yup.string().required()),
    isActive: Yup.boolean().required(),
  });
}
