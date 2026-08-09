import * as Yup from "yup";
import type { TFunction } from "i18next";

export interface ForgotPasswordFormValues {
  email: string;
}

export function getForgotPasswordSchema(t: TFunction) {
  return Yup.object({
    email: Yup.string().required(t("auth.forgotPassword.emailRequired")),
  });
}
