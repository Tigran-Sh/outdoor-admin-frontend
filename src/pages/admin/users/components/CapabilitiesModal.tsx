import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown/MultiSelectDropdown";

import { updateUserCapabilities } from "@/services/adminUsers.api";
import { ApiError } from "@/types/apiError";
import type { Capability } from "@/types/auth";
import type { AdminUser, CapabilityDefinition } from "@/types/adminUser";

import { getCapabilitiesSchema, type CapabilitiesFormValues } from "../UserForm.schema";

interface CapabilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  capabilityOptions: CapabilityDefinition[];
}

function CapabilitiesModal({ isOpen, onClose, user, capabilityOptions }: CapabilitiesModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (capabilities: Capability[]) =>
      updateUserCapabilities(user!.id, { capabilities }),
  });

  const formik = useFormik<CapabilitiesFormValues>({
    enableReinitialize: true,
    initialValues: { capabilities: user?.capabilities ?? [] },
    validationSchema: getCapabilitiesSchema(t),
    onSubmit: async (values, { setStatus }) => {
      setStatus(undefined);
      try {
        await mutation.mutateAsync(values.capabilities);
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
      title={t("admin.users.capabilitiesModal.title")}
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
            {t("admin.users.capabilitiesModal.submit")}
          </Button>
        </>
      }
    >
      {formik.status && (
        <div className="alert alert-danger" role="alert">
          {formik.status}
        </div>
      )}

      <p className="text-muted">{t("admin.users.capabilitiesModal.helperText")}</p>

      <form noValidate onSubmit={formik.handleSubmit}>
        <MultiSelectDropdown
          label={t("admin.users.fields.capabilities.label")}
          placeholder={t("admin.users.fields.capabilities.placeholder")}
          options={capabilityOptions.map((capability) => ({
            value: capability.key,
            label: t(`admin.capabilityNames.${capability.key}`),
          }))}
          value={formik.values.capabilities}
          onChange={(selected) => formik.setFieldValue("capabilities", selected as Capability[])}
          error={
            formik.touched.capabilities ? String(formik.errors.capabilities ?? "") : undefined
          }
          containerClassName="mb-0"
        />
      </form>
    </Modal>
  );
}

export default CapabilitiesModal;
