import { useFormik } from "formik";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Input from "@/components/ui/Input/Input";

import { useAuth } from "@/app/providers/useAuth";
import { getHomePathForRole } from "@/app/router/roleHome";

import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";

import { ApiError } from "@/types/apiError";

import AuthCard from "./components/AuthCard";
import { getLoginSchema, type LoginFormValues } from "./LoginPage.schema";

function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: getLoginSchema(t),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(undefined);
      try {
        const user = await login(values.email, values.password, values.rememberMe);
        const from = (location.state as { from?: Location } | null)?.from;
        navigate(from?.pathname ?? getHomePathForRole(user.role), { replace: true });
      } catch (error) {
        const message =
          error instanceof ApiError && error.fieldError("non_field_errors")
            ? t("auth.login.invalidCredentials")
            : t("auth.login.genericError");
        setStatus(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useRevalidateOnLanguageChange(formik.validateForm);

  return (
    <AuthCard>
      <div className="text-center mt-2">
        <h5 className="text-primary">{t("auth.login.welcomeBack")}</h5>
        <p className="text-muted">{t("auth.login.signInToContinue")}</p>
      </div>

      <div className="p-2 mt-4">
        {formik.status && (
          <div className="alert alert-danger" role="alert">
            {formik.status}
          </div>
        )}

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

          <Checkbox
            id="remember-me"
            name="rememberMe"
            label={t("auth.login.rememberMe")}
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
          />

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
