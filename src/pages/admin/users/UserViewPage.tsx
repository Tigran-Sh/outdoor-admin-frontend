import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";

import { listCapabilities } from "@/services/adminRoles.api";
import { activateUser, deactivateUser, getUser } from "@/services/adminUsers.api";
import { ROLE_BADGE_VARIANT } from "@/constants/roles";

import CapabilitiesModal from "./components/CapabilitiesModal";
import ChangeRoleModal from "./components/ChangeRoleModal";

type ConfirmActionType = "activate" | "deactivate";

function UserViewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isCapabilitiesOpen, setIsCapabilitiesOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null);

  const userQuery = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getUser(id!),
    enabled: Boolean(id),
    retry: false,
  });

  const capabilitiesQuery = useQuery({
    queryKey: ["admin-capabilities"],
    queryFn: listCapabilities,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (action: ConfirmActionType) =>
      action === "activate" ? activateUser(id!) : deactivateUser(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
      setConfirmAction(null);
    },
  });

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

  const user = userQuery.data;

  return (
    <>
      <Breadcrumbs
        title={user?.full_name ?? ""}
        items={[{ label: t("sidebar.users"), to: "/admin/users" }]}
      />

      {user && (
        <div className="d-flex justify-content-end flex-wrap gap-2 mb-3">
          <Button
            appearance="soft"
            variant="secondary"
            onClick={() => setIsChangeRoleOpen(true)}
          >
            <i className="ri-shield-user-line align-bottom me-1" aria-hidden="true" />
            {t("admin.users.changeRole")}
          </Button>

          {user.role === "internal_admin" && (
            <Button
              appearance="soft"
              variant="info"
              onClick={() => setIsCapabilitiesOpen(true)}
            >
              <i className="ri-settings-4-line align-bottom me-1" aria-hidden="true" />
              {t("admin.users.manageCapabilities")}
            </Button>
          )}

          <Button
            appearance="soft"
            variant={user.is_active ? "danger" : "success"}
            onClick={() => setConfirmAction(user.is_active ? "deactivate" : "activate")}
          >
            <i
              className={user.is_active ? "ri-forbid-line" : "ri-checkbox-circle-line"}
              aria-hidden="true"
            />
            <span className="align-bottom ms-1">
              {user.is_active ? t("admin.users.deactivate") : t("admin.users.activate")}
            </span>
          </Button>

          <Link to={`/admin/users/${user.id}/edit`} className="btn btn-success">
            <i className="ri-edit-box-line align-bottom me-1" aria-hidden="true" />
            {t("admin.users.view.editUser")}
          </Link>
        </div>
      )}

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
                  <Badge variant={user.is_active ? "success" : "danger"} appearance="subtle" pill>
                    {user.is_active ? t("common.active") : t("admin.users.blocked")}
                  </Badge>
                </div>

                <div className="hstack text-muted gap-3 flex-wrap">
                  <div>
                    <i className="ri-mail-line me-1 align-middle" aria-hidden="true" />
                    {user.email}
                  </div>
                  <div>
                    <i className="ri-calendar-line me-1 align-middle" aria-hidden="true" />
                    {t("admin.users.view.memberSince")} {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <i className="ri-user-settings-line me-1 align-middle" aria-hidden="true" />
                    {t("admin.users.view.createdBy")}{" "}
                    {user.created_by ?? t("admin.users.createdByPlatform")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {user && (
        <Card>
          <CardBody>
            <h5 className="card-title mb-3">{t("admin.users.view.capabilities")}</h5>

            {user.capabilities.length > 0 ? (
              <div className="d-flex flex-wrap gap-1">
                {user.capabilities.map((capability) => (
                  <Badge key={capability} variant="primary" appearance="subtle" pill>
                    {t(`admin.capabilityNames.${capability}`)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">{t("admin.users.view.noCapabilities")}</p>
            )}
          </CardBody>
        </Card>
      )}

      <ChangeRoleModal
        isOpen={isChangeRoleOpen}
        onClose={() => setIsChangeRoleOpen(false)}
        user={user ?? null}
      />

      <CapabilitiesModal
        isOpen={isCapabilitiesOpen}
        onClose={() => setIsCapabilitiesOpen(false)}
        user={user ?? null}
        capabilityOptions={capabilitiesQuery.data ?? []}
      />

      <ConfirmDialog
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmAction && toggleActiveMutation.mutate(confirmAction)}
        loading={toggleActiveMutation.isPending}
        icon={confirmAction === "deactivate" ? "ri-forbid-line" : "ri-checkbox-circle-line"}
        confirmVariant={confirmAction === "deactivate" ? "danger" : "success"}
        title={
          confirmAction === "deactivate"
            ? t("admin.users.confirmDeactivate.title")
            : t("admin.users.confirmActivate.title")
        }
        message={
          confirmAction === "deactivate"
            ? t("admin.users.confirmDeactivate.message")
            : t("admin.users.confirmActivate.message")
        }
        confirmLabel={
          confirmAction === "deactivate"
            ? t("admin.users.confirmDeactivate.confirm")
            : t("admin.users.confirmActivate.confirm")
        }
        cancelLabel={t("common.cancel")}
      />
    </>
  );
}

export default UserViewPage;
