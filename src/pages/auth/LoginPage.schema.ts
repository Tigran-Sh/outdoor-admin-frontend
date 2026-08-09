import * as Yup from "yup";
import type { TFunction } from "i18next";

export interface LoginFormValues {
  email: string;
  password: string;
}

export function getLoginSchema(t: TFunction) {
  return Yup.object({
    email: Yup.string()
      .email(t("auth.login.emailInvalid"))
      .required(t("auth.login.emailRequired")),
    password: Yup.string().required(t("auth.login.passwordRequired")),
  });
}
