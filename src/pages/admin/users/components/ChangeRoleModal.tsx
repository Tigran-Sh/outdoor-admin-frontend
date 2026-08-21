import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";
import Select from "@/components/ui/Select/Select";

import { updateUserRole } from "@/services/adminUsers.api";
import { ApiError } from "@/types/apiError";
import { ROLES, type Role } from "@/types/auth";
import type { AdminUser } from "@/types/adminUser";

import { getChangeRoleSchema, type ChangeRoleFormValues } from "../UserForm.schema";

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

function ChangeRoleModal({ isOpen, onClose, user }: ChangeRoleModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (role: Role) => updateUserRole(user!.id, { role }),
  });

  const formik = useFormik<ChangeRoleFormValues>({
    enableReinitialize: true,
    initialValues: { role: user?.role ?? "" },
    validationSchema: getChangeRoleSchema(t),
    onSubmit: async (values, { setStatus }) => {
      setStatus(undefined);
      try {
        await mutation.mutateAsync(values.role as Role);
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        onClose();
      } catch (error) {
        setStatus(
          error instanceof ApiError ? error.generalMessage() : t("auth.login.genericError"),
        );
      }
    },
  });

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("admin.users.changeRoleModal.title")}
      footer={
        <>
          <Button appearance="outline" variant="secondary" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            loading={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
          >
            {t("admin.users.changeRoleModal.submit")}
          </Button>
        </>
      }
    >
      {formik.status && (
        <div className="alert alert-danger" role="alert">
          {formik.status}
        </div>
      )}

      <form noValidate onSubmit={formik.handleSubmit}>
        <Select
          label={t("admin.users.fields.role.label")}
          name="role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.role}
          error={formik.touched.role ? formik.errors.role : undefined}
          containerClassName="mb-0"
        >
          <option value="">{t("admin.users.fields.role.placeholder")}</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {t(`admin.roleNames.${role}`)}
            </option>
          ))}
        </Select>
      </form>
    </Modal>
  );
}

export default ChangeRoleModal;
