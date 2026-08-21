import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Input from "@/components/ui/Input/Input";

import { getUser, updateUser } from "@/services/adminUsers.api";
import { ApiError } from "@/types/apiError";

import { getEditUserSchema, type EditUserFormValues } from "./UserForm.schema";

function EditUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getUser(id!),
    enabled: Boolean(id),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (values: EditUserFormValues) => updateUser(id!, values),
  });

  const formik = useFormik<EditUserFormValues>({
    enableReinitialize: true,
    initialValues: {
      full_name: userQuery.data?.full_name ?? "",
      email: userQuery.data?.email ?? "",
    },
    validationSchema: getEditUserSchema(t),
    onSubmit: async (values, { setErrors, setStatus }) => {
      setStatus(undefined);
      try {
        await mutation.mutateAsync(values);
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
        navigate("/admin/users");
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.details) {
            const fieldErrors: Partial<Record<keyof EditUserFormValues, string>> = {};
            for (const field of ["full_name", "email"] as const) {
              const message = error.fieldError(field);
              if (message) fieldErrors[field] = message;
            }
            setErrors(fieldErrors);
          }
          setStatus(error.generalMessage());
        } else {
          setStatus(t("auth.login.genericError"));
        }
      }
    },
  });

  function handleCancel() {
    navigate(id ? `/admin/users/${id}` : "/admin/users");
  }

  if (userQuery.isError) {
    return (
      <>
        <Breadcrumbs
          title={t("admin.users.view.notFound")}
          items={[{ label: t("sidebar.users"), to: "/admin/users" }]}
        />

        <Card>
          <CardBody>
            <p className="text-muted mb-3">{t("admin.users.view.notFoundMessage")}</p>
            <Link to="/admin/users" className="btn btn-primary">
              {t("admin.users.view.backToUsers")}
            </Link>
          </CardBody>
        </Card>
      </>
    );
  }

  const pageTitle = userQuery.data?.full_name || t("admin.users.edit.title");

  return (
    <>
      <Breadcrumbs
        title={pageTitle}
        items={[
          { label: t("sidebar.users"), to: "/admin/users" },
          ...(id ? [{ label: pageTitle, to: `/admin/users/${id}` }] : []),
        ]}
      />

      <Card>
        <CardBody>
          {formik.status && (
            <div className="alert alert-danger" role="alert">
              {formik.status}
            </div>
          )}

          <form noValidate onSubmit={formik.handleSubmit}>
            <Input
              label={t("admin.users.fields.fullName.label")}
              name="full_name"
              placeholder={t("admin.users.fields.fullName.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.full_name}
              error={formik.touched.full_name ? formik.errors.full_name : undefined}
              disabled={userQuery.isLoading}
            />

            <Input
              label={t("admin.users.fields.email.label")}
              name="email"
              type="email"
              placeholder={t("admin.users.fields.email.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email ? formik.errors.email : undefined}
              disabled={userQuery.isLoading}
              containerClassName="mb-0"
            />
          </form>
        </CardBody>

        <CardFooter className="d-flex justify-content-end gap-2">
          <Button appearance="outline" variant="secondary" onClick={handleCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="success"
            loading={formik.isSubmitting}
            disabled={userQuery.isLoading}
            onClick={() => formik.handleSubmit()}
          >
            {t("admin.users.edit.submit")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default EditUserPage;
