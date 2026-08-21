import type { ChangeEvent } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card/Card";
import Input from "@/components/ui/Input/Input";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown/MultiSelectDropdown";
import Select from "@/components/ui/Select/Select";

import { listCapabilities } from "@/services/adminRoles.api";
import { createUser } from "@/services/adminUsers.api";
import { ApiError } from "@/types/apiError";
import { ROLES, type Capability, type Role } from "@/types/auth";

import {
  getCreateUserSchema,
  initialCreateUserFormValues,
  type CreateUserFormValues,
} from "./UserForm.schema";

function CreateUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const capabilitiesQuery = useQuery({
    queryKey: ["admin-capabilities"],
    queryFn: listCapabilities,
  });

  const mutation = useMutation({ mutationFn: createUser });

  const formik = useFormik<CreateUserFormValues>({
    initialValues: initialCreateUserFormValues,
    validationSchema: getCreateUserSchema(t),
    onSubmit: async (values, { setErrors, setStatus }) => {
      setStatus(undefined);
      try {
        await mutation.mutateAsync({
          full_name: values.full_name,
          email: values.email,
          role: values.role as Role,
          password: values.password,
          capabilities: values.role === "internal_admin" ? values.capabilities : undefined,
        });
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        navigate("/admin/users");
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.details) {
            const fieldErrors: Partial<Record<keyof CreateUserFormValues, string>> = {};
            for (const field of [
              "full_name",
              "email",
              "role",
              "password",
              "capabilities",
            ] as const) {
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
    navigate("/admin/users");
  }

  function handleRoleChange(event: ChangeEvent<HTMLSelectElement>) {
    formik.handleChange(event);
    if (event.target.value !== "internal_admin") {
      formik.setFieldValue("capabilities", []);
    }
  }

  return (
    <>
      <Breadcrumbs
        title={t("admin.users.create.title")}
        items={[{ label: t("sidebar.users"), to: "/admin/users" }]}
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
            />

            <Select
              label={t("admin.users.fields.role.label")}
              name="role"
              onChange={handleRoleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
              error={formik.touched.role ? formik.errors.role : undefined}
            >
              <option value="">{t("admin.users.fields.role.placeholder")}</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {t(`admin.roleNames.${role}`)}
                </option>
              ))}
            </Select>

            <Input
              label={t("admin.users.fields.password.label")}
              name="password"
              type="password"
              placeholder={t("admin.users.fields.password.placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password ? formik.errors.password : undefined}
            />

            {formik.values.role === "internal_admin" && (
              <MultiSelectDropdown
                label={t("admin.users.fields.capabilities.label")}
                placeholder={t("admin.users.fields.capabilities.placeholder")}
                options={(capabilitiesQuery.data ?? []).map((capability) => ({
                  value: capability.key,
                  label: t(`admin.capabilityNames.${capability.key}`),
                }))}
                value={formik.values.capabilities}
                onChange={(selected) =>
                  formik.setFieldValue("capabilities", selected as Capability[])
                }
                error={
                  formik.touched.capabilities
                    ? String(formik.errors.capabilities ?? "")
                    : undefined
                }
                containerClassName="mb-0"
              />
            )}
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
            onClick={() => formik.handleSubmit()}
          >
            {t("admin.users.create.submit")}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default CreateUserPage;
