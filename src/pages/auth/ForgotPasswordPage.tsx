import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";

import AuthCard from "./components/AuthCard";

interface ForgotPasswordFormValues {
  email: string;
}

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required(t("auth.forgotPassword.emailRequired")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // TODO: wire up to the auth service.
      console.log(values);
      setSubmitting(false);
      setSubmitted(true);
    },
  });

  return (
    <AuthCard
      afterCard={
        <div className="mt-4 text-center">
          <p className="mb-0">
            {t("auth.forgotPassword.rememberPassword")}{" "}
            <Link to="/" className="fw-semibold text-primary text-decoration-underline">
              {t("auth.forgotPassword.backToLogin")}
            </Link>
          </p>
        </div>
      }
    >
      <div className="text-center mt-2">
        <h5 className="text-primary">{t("auth.forgotPassword.title")}</h5>
        <p className="text-muted">{t("auth.forgotPassword.subtitle")}</p>
        <i className="ri-mail-send-line display-5 text-success mb-3" />
      </div>

      <div className="alert alert-warning border-0 text-center mb-2 mx-2" role="alert">
        {t("auth.forgotPassword.instructions")}
      </div>

      <div className="p-2">
        {submitted && (
          <div className="alert alert-success" role="alert">
            {t("auth.forgotPassword.successMessage")}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <Input
            label={t("auth.forgotPassword.emailLabel")}
            name="email"
            type="email"
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email ? formik.errors.email : undefined}
            containerClassName="mb-4"
          />

          <div className="text-center mt-4">
            <Button type="submit" variant="success" className="w-100" loading={formik.isSubmitting}>
              {t("auth.forgotPassword.submit")}
            </Button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}

export default ForgotPasswordPage;
