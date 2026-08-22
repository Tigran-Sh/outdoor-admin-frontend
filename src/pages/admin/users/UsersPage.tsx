import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import Input from "@/components/ui/Input/Input";
import Pagination from "@/components/ui/Pagination/Pagination";
import RowActionsMenu from "@/components/ui/RowActionsMenu/RowActionsMenu";
import Select from "@/components/ui/Select/Select";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import {
  activateUser,
  deactivateUser,
  listUsers,
} from "@/services/adminUsers.api";
import { listCapabilities } from "@/services/adminRoles.api";
import { ROLE_BADGE_VARIANT } from "@/constants/roles";
import { ROLES, type Role } from "@/types/auth";
import type { AdminUser, AdminUserOrderingField } from "@/types/adminUser";

import CapabilitiesModal from "./components/CapabilitiesModal";
import ChangeRoleModal from "./components/ChangeRoleModal";

const PAGE_SIZE = 20;

type StatusFilter = "" | "true" | "false";
type ConfirmActionType = "activate" | "deactivate";

interface ConfirmActionState {
  type: ConfirmActionType;
  user: AdminUser;
}

function UsersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [ordering, setOrdering] = useState("-created_at");

  const search = useDebouncedValue(searchInput, 400);

  // Reset to page 1 whenever the filters change, without an extra render
  // pass (see https://react.dev/learn/you-might-not-need-an-effect).
  const filterKey = `${search}|${roleFilter}|${statusFilter}|${ordering}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const [changingRoleUser, setChangingRoleUser] = useState<AdminUser | null>(
    null,
  );
  const [capabilitiesUser, setCapabilitiesUser] = useState<AdminUser | null>(
    null,
  );
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(
    null,
  );

  const usersQuery = useQuery({
    queryKey: [
      "admin-users",
      { page, pageSize: PAGE_SIZE, search, roleFilter, statusFilter, ordering },
    ],
    queryFn: () =>
      listUsers({
        page,
        page_size: PAGE_SIZE,
        search: search || undefined,
        role: roleFilter || undefined,
        is_active: statusFilter === "" ? undefined : statusFilter === "true",
        ordering,
      }),
  });

  const allCountQuery = useQuery({
    queryKey: ["admin-users-count", "all"],
    queryFn: () => listUsers({ page_size: 1 }),
  });

  const activeCountQuery = useQuery({
    queryKey: ["admin-users-count", "active"],
    queryFn: () => listUsers({ page_size: 1, is_active: true }),
  });

  const blockedCountQuery = useQuery({
    queryKey: ["admin-users-count", "blocked"],
    queryFn: () => listUsers({ page_size: 1, is_active: false }),
  });

  const capabilitiesQuery = useQuery({
    queryKey: ["admin-capabilities"],
    queryFn: listCapabilities,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (action: ConfirmActionState) =>
      action.type === "activate"
        ? activateUser(action.user.id)
        : deactivateUser(action.user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-count"] });
      setConfirmAction(null);
    },
  });

  function toggleOrdering(field: AdminUserOrderingField) {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  }

  function sortIcon(field: AdminUserOrderingField) {
    if (ordering === field) return "ri-arrow-up-line";
    if (ordering === `-${field}`) return "ri-arrow-down-line";
    return "ri-expand-up-down-line text-muted";
  }

  function sortableHeader(field: AdminUserOrderingField, label: string) {
    return (
      <button
        type="button"
        className="btn btn-link p-0 text-reset text-decoration-none d-inline-flex align-items-center gap-1"
        onClick={() => toggleOrdering(field)}
      >
        {label}
        <i className={sortIcon(field)} aria-hidden="true" />
      </button>
    );
  }

  const columns: TableColumn<AdminUser>[] = [
    {
      key: "full_name",
      header: sortableHeader("full_name", t("admin.users.table.name")),
      render: (row) => (
        <Link
          to={`/admin/users/${row.id}`}
          className="d-flex align-items-center gap-2"
        >
          <Avatar name={row.full_name} size="xs" />
          <span className="fw-medium">{row.full_name}</span>
        </Link>
      ),
    },
    {
      key: "email",
      header: sortableHeader("email", t("admin.users.table.email")),
      render: (row) => row.email,
    },
    {
      key: "role",
      header: t("admin.users.table.role"),
      render: (row) => (
        <Badge variant={ROLE_BADGE_VARIANT[row.role]} appearance="subtle" pill>
          {t(`admin.roleNames.${row.role}`)}
        </Badge>
      ),
    },
    {
      key: "is_active",
      header: t("admin.users.table.status"),
      render: (row) => (
        <Badge
          variant={row.is_active ? "success" : "danger"}
          appearance="subtle"
          pill
        >
          {row.is_active ? t("common.active") : t("admin.users.blocked")}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: sortableHeader("created_at", t("admin.users.table.createdAt")),
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      header: t("admin.users.table.actions"),
      headerClassName: "text-end",
      className: "text-end",
      render: (row) => (
        <RowActionsMenu
          ariaLabel={t("admin.users.table.actions")}
          actions={[
            {
              key: "edit",
              label: t("common.edit"),
              icon: "ri-pencil-fill",
              onClick: () => navigate(`/admin/users/${row.id}/edit`),
            },
            {
              key: "changeRole",
              label: t("admin.users.changeRole"),
              icon: "ri-shield-user-line",
              onClick: () => setChangingRoleUser(row),
            },
            {
              key: "capabilities",
              label: t("admin.users.manageCapabilities"),
              icon: "ri-settings-4-line",
              onClick: () => setCapabilitiesUser(row),
              hidden: row.role !== "internal_admin",
            },
            {
              key: "toggleActive",
              label: row.is_active
                ? t("admin.users.deactivate")
                : t("admin.users.activate"),
              icon: row.is_active
                ? "ri-forbid-line"
                : "ri-checkbox-circle-line",
              variant: row.is_active ? "danger" : "default",
              onClick: () =>
                setConfirmAction({
                  type: row.is_active ? "deactivate" : "activate",
                  user: row,
                }),
            },
          ]}
        />
      ),
    },
  ];

  const users = usersQuery.data?.results ?? [];
  const totalCount = usersQuery.data?.count ?? 0;

  return (
    <>
      <Breadcrumbs title={t("admin.users.title")} />

      <Card>
        <CardHeader
          title={t("admin.users.title")}
          actions={
            <Button
              variant="primary"
              leftIcon={<i className="ri-add-line align-bottom" />}
              onClick={() => navigate("/admin/users/create")}
            >
              {t("admin.users.createUser")}
            </Button>
          }
        />

        <CardBody>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {(
              [
                {
                  key: "",
                  label: t("admin.users.filters.all"),
                  count: allCountQuery.data?.count,
                },
                {
                  key: "true",
                  label: t("common.active"),
                  count: activeCountQuery.data?.count,
                },
                {
                  key: "false",
                  label: t("admin.users.blocked"),
                  count: blockedCountQuery.data?.count,
                },
              ] as const
            ).map((tab) => (
              <Button
                key={tab.key}
                type="button"
                size="sm"
                variant={tab.key === "" ? "primary" : "secondary"}
                appearance={statusFilter === tab.key ? "soft" : "ghost"}
                className="rounded-pill"
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
                <span className="ms-1">{tab.count ?? "–"}</span>
              </Button>
            ))}
          </div>

          <div className="d-flex flex-wrap align-items-start gap-2 mb-5">
            <div className="search-box" style={{ maxWidth: 300 }}>
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("admin.users.filters.searchPlaceholder")}
                aria-label={t("admin.users.filters.searchPlaceholder")}
                containerClassName="mb-0"
              />
              <i className="ri-search-line search-icon" aria-hidden="true" />
            </div>

            <Select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as Role | "")
              }
              containerClassName="mb-0"
              style={{ maxWidth: 200 }}
              aria-label={t("admin.users.filters.allRoles")}
            >
              <option value="">{t("admin.users.filters.allRoles")}</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {t(`admin.roleNames.${role}`)}
                </option>
              ))}
            </Select>
          </div>

          {usersQuery.isError ? (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{t("common.loadError")}</span>
              <Button
                variant="danger"
                appearance="outline"
                size="sm"
                onClick={() => usersQuery.refetch()}
              >
                {t("common.retry")}
              </Button>
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={users}
                getRowKey={(row) => row.id}
                emptyMessage={t("admin.users.empty")}
                card
                className="bg-light"
              />

              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={totalCount}
                onPageChange={setPage}
              />
            </>
          )}
        </CardBody>
      </Card>

      <ChangeRoleModal
        isOpen={changingRoleUser !== null}
        onClose={() => setChangingRoleUser(null)}
        user={changingRoleUser}
      />

      <CapabilitiesModal
        isOpen={capabilitiesUser !== null}
        onClose={() => setCapabilitiesUser(null)}
        user={capabilitiesUser}
        capabilityOptions={capabilitiesQuery.data ?? []}
      />

      <ConfirmDialog
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={() =>
          confirmAction && toggleActiveMutation.mutate(confirmAction)
        }
        loading={toggleActiveMutation.isPending}
        icon={
          confirmAction?.type === "deactivate"
            ? "ri-forbid-line"
            : "ri-checkbox-circle-line"
        }
        confirmVariant={
          confirmAction?.type === "deactivate" ? "danger" : "success"
        }
        title={
          confirmAction?.type === "deactivate"
            ? t("admin.users.confirmDeactivate.title")
            : t("admin.users.confirmActivate.title")
        }
        message={
          confirmAction?.type === "deactivate"
            ? t("admin.users.confirmDeactivate.message")
            : t("admin.users.confirmActivate.message")
        }
        confirmLabel={
          confirmAction?.type === "deactivate"
            ? t("admin.users.confirmDeactivate.confirm")
            : t("admin.users.confirmActivate.confirm")
        }
        cancelLabel={t("common.cancel")}
      />
    </>
  );
}

export default UsersPage;
