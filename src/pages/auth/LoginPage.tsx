import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Input from "@/components/ui/Input/Input";

import AuthCard from "./components/AuthCard";
import { getLoginSchema, type LoginFormValues } from "./LoginPage.schema";

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: getLoginSchema(t),
    onSubmit: (values, { setSubmitting }) => {
      // TODO: wire up to the auth service.
      console.log(values);
      setSubmitting(false);
      navigate("/admin/dashboard");
    },
  });

  return (
    <AuthCard>
      <div className="text-center mt-2">
        <h5 className="text-primary">{t("auth.login.welcomeBack")}</h5>
        <p className="text-muted">{t("auth.login.signInToContinue")}</p>
      </div>

      <div className="p-2 mt-4">
        <form onSubmit={formik.handleSubmit} noValidate>
          <Input
            label={t("auth.login.emailLabel")}
            name="email"
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email ? formik.errors.email : undefined}
          />

          <Input
            label={t("auth.login.passwordLabel")}
            labelAddon={
              <Link to="/forgot-password" className="text-muted">
                {t("auth.login.forgotPassword")}
              </Link>
            }
            name="password"
            type="password"
            placeholder={t("auth.login.passwordPlaceholder")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password ? formik.errors.password : undefined}
          />

          <Checkbox id="remember-me" label={t("auth.login.rememberMe")} />

          <div className="mt-4">
            <Button type="submit" variant="success" className="w-100" loading={formik.isSubmitting}>
              {t("auth.login.signIn")}
            </Button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}

export default LoginPage;
