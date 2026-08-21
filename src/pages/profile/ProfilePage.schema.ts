import * as Yup from "yup";
import type { TFunction } from "i18next";

export interface ChangePasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export const initialChangePasswordValues: ChangePasswordFormValues = {
  current_password: "",
  new_password: "",
  confirm_new_password: "",
};

export function getChangePasswordSchema(t: TFunction) {
  return Yup.object({
    current_password: Yup.string().required(
      t("profile.changePassword.validation.currentRequired"),
    ),
    new_password: Yup.string()
      .min(8, t("profile.changePassword.validation.newMinLength"))
      .notOneOf(
        [Yup.ref("current_password")],
        t("profile.changePassword.validation.newSameAsCurrent"),
      )
      .required(t("profile.changePassword.validation.newRequired")),
    confirm_new_password: Yup.string()
      .oneOf([Yup.ref("new_password")], t("profile.changePassword.validation.confirmMismatch"))
      .required(t("profile.changePassword.validation.confirmRequired")),
  });
}
