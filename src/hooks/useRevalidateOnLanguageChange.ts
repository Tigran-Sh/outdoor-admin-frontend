import { useEffect } from "react";
import type { FormikProps } from "formik";
import { useTranslation } from "react-i18next";

export function useRevalidateOnLanguageChange<Values>(
  validateForm: FormikProps<Values>["validateForm"],
) {
  const { i18n } = useTranslation();

  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);
}
