import * as Yup from "yup";
import type { TFunction } from "i18next";

import { ROLES, type Capability, type Role } from "@/types/auth";

export interface CreateUserFormValues {
  full_name: string;
  email: string;
  role: Role | "";
  password: string;
  capabilities: Capability[];
}

export const initialCreateUserFormValues: CreateUserFormValues = {
  full_name: "",
  email: "",
  role: "",
  password: "",
  capabilities: [],
};

export function getCreateUserSchema(t: TFunction) {
  return Yup.object({
    full_name: Yup.string().required(t("admin.users.validation.fullNameRequired")),
    email: Yup.string()
      .email(t("admin.users.validation.emailInvalid"))
      .required(t("admin.users.validation.emailRequired")),
    role: Yup.string()
      .oneOf([...ROLES])
      .required(t("admin.users.validation.roleRequired")),
    password: Yup.string()
      .min(8, t("admin.users.validation.passwordMinLength"))
      .required(t("admin.users.validation.passwordRequired")),
    capabilities: Yup.array()
      .of(Yup.string().required())
      .when("role", {
        is: "internal_admin",
        then: (schema) => schema.min(1, t("admin.users.validation.capabilitiesRequired")),
      }),
  });
}

export interface EditUserFormValues {
  full_name: string;
  email: string;
}

export function getEditUserSchema(t: TFunction) {
  return Yup.object({
    full_name: Yup.string().required(t("admin.users.validation.fullNameRequired")),
    email: Yup.string()
      .email(t("admin.users.validation.emailInvalid"))
      .required(t("admin.users.validation.emailRequired")),
  });
}

export interface ChangeRoleFormValues {
  role: Role | "";
}

export function getChangeRoleSchema(t: TFunction) {
  return Yup.object({
    role: Yup.string()
      .oneOf([...ROLES])
      .required(t("admin.users.validation.roleRequired")),
  });
}

export interface CapabilitiesFormValues {
  capabilities: Capability[];
}

export function getCapabilitiesSchema(t: TFunction) {
  return Yup.object({
    capabilities: Yup.array()
      .of(Yup.string().required())
      .min(1, t("admin.users.validation.capabilitiesRequired")),
  });
}
