import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody } from "@/components/ui/Card/Card";
import Input from "@/components/ui/Input/Input";

import { useAuth } from "@/app/providers/useAuth";
import { changePassword } from "@/services/auth.api";
import { ROLE_BADGE_VARIANT } from "@/constants/roles";
import { ApiError } from "@/types/apiError";

import {
  getChangePasswordSchema,
  initialChangePasswordValues,
  type ChangePasswordFormValues,
} from "./ProfilePage.schema";

function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      }),
  });

  const formik = useFormik<ChangePasswordFormValues>({
    initialValues: initialChangePasswordValues,
    validationSchema: getChangePasswordSchema(t),
    onSubmit: async (values, { setErrors, setStatus, resetForm }) => {
      setStatus(undefined);
      try {
        await mutation.mutateAsync(values);
        resetForm();
        setStatus({ type: "success", message: t("profile.changePassword.success") });
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.details) {
            const fieldErrors: Partial<Record<keyof ChangePasswordFormValues, string>> = {};
            const currentPasswordError = error.fieldError("current_password");
            const newPasswordError = error.fieldError("new_password");
            if (currentPasswordError) fieldErrors.current_password = currentPasswordError;
            if (newPasswordError) fieldErrors.new_password = newPasswordError;
            setErrors(fieldErrors);
          }
          setStatus({ type: "error", message: error.generalMessage() });
        } else {
          setStatus({ type: "error", message: t("auth.login.genericError") });
        }
      }
    },
  });

  return (
    <>
      <Breadcrumbs title={t("profile.title")} />

      <Card>
        <CardBody>
          {!user ? (
            <div className="placeholder-glow">
              <span className="placeholder col-4 mb-2 d-block" />
              <span className="placeholder col-6 d-block" />
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <Avatar name={user.full_name} size="lg" />

              <div className="flex-grow-1">
                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                  <h4 className="mb-0">{user.full_name}</h4>
                  <Badge variant={ROLE_BADGE_VARIANT[user.role]} appearance="subtle" pill>
                    {t(`admin.roleNames.${user.role}`)}
                  </Badge>
                </div>

                <div className="hstack text-muted gap-3 flex-wrap">
                  <div>
                    <i className="ri-mail-line me-1 align-middle" aria-hidden="true" />
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {user && user.capabilities.length > 0 && (
        <Card>
          <CardBody>
            <h5 className="card-title mb-3">{t("admin.users.view.capabilities")}</h5>
            <div className="d-flex flex-wrap gap-1">
              {user.capabilities.map((capability) => (
                <Badge key={capability} variant="primary" appearance="subtle" pill>
                  {t(`admin.capabilityNames.${capability}`)}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <h5 className="card-title mb-3">{t("profile.changePassword.title")}</h5>

          {formik.status && (
            <div
              className={`alert ${formik.status.type === "success" ? "alert-success" : "alert-danger"}`}
              role="alert"
            >
              {formik.status.message}
            </div>
          )}

          <form
            noValidate
            onSubmit={formik.handleSubmit}
            className="col-xxl-6"
            autoComplete="off"
          >
            <Input
              label={t("profile.changePassword.fields.currentPassword")}
              name="current_password"
              type="password"
              autoComplete="current-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.current_password}
              error={
                formik.touched.current_password ? formik.errors.current_password : undefined
              }
            />

            <Input
              label={t("profile.changePassword.fields.newPassword")}
              name="new_password"
              type="password"
              autoComplete="new-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.new_password}
              error={formik.touched.new_password ? formik.errors.new_password : undefined}
              helperText={t("profile.changePassword.fields.newPasswordHelper")}
            />

            <Input
              label={t("profile.changePassword.fields.confirmNewPassword")}
              name="confirm_new_password"
              type="password"
              autoComplete="new-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirm_new_password}
              error={
                formik.touched.confirm_new_password
                  ? formik.errors.confirm_new_password
                  : undefined
              }
              containerClassName="mb-0"
            />

            <div className="mt-4">
              <Button type="submit" variant="success" loading={formik.isSubmitting}>
                {t("profile.changePassword.submit")}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default ProfilePage;
