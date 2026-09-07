import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import Input from "@/components/ui/Input/Input";
import Pagination from "@/components/ui/Pagination/Pagination";
import RowActionsMenu from "@/components/ui/RowActionsMenu/RowActionsMenu";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";

import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { listTeamMembers, setTeamMemberActive } from "@/services/teamMembers.api";
import { ApiError } from "@/types/apiError";
import type { TeamMember } from "@/types/teamMember";

const PAGE_SIZE = 20;

function TeamPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [ordering, setOrdering] = useState("user__full_name");
  const [memberToToggle, setMemberToToggle] = useState<TeamMember | null>(null);

  const search = useDebouncedValue(searchInput, 400);

  const filterKey = `${search}|${ordering}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const membersQuery = useQuery({
    queryKey: ["team-members", { page, search, ordering }],
    queryFn: () =>
      listTeamMembers({ page, page_size: PAGE_SIZE, search: search || undefined, ordering }),
    retry: false,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (member: TeamMember) => setTeamMemberActive(member.id, !member.accountIsActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setMemberToToggle(null);
    },
  });

  function toggleOrdering(field: string) {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  }

  function sortIcon(field: string) {
    if (ordering === field) return "ri-arrow-up-line";
    if (ordering === `-${field}`) return "ri-arrow-down-line";
    return "ri-expand-up-down-line text-muted";
  }

  function sortableHeader(field: string, label: string) {
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

  const columns: TableColumn<TeamMember>[] = [
    {
      key: "name",
      header: sortableHeader("user__full_name", t("team.table.name")),
      render: (row) => <Link to={`/club/team/${row.id}`}>{row.fullName}</Link>,
    },
    {
      key: "role",
      header: t("team.table.role"),
      render: (row) => (
        <Badge variant="info" appearance="subtle">
          {t(`admin.roleNames.${row.platformRole}`)}
        </Badge>
      ),
    },
    {
      key: "activityTypes",
      header: t("team.table.activityTypes"),
      render: (row) => (
        <div className="d-flex flex-wrap gap-1">
          {row.activityTypeIds.map((activityTypeId) => {
            const activityType = ACTIVITY_TYPES.find((item) => item.id === activityTypeId);
            if (!activityType) return null;

            return (
              <Badge key={activityTypeId} variant={activityType.variant} appearance="subtle">
                {t(`activityTypes.${activityTypeId}`)}
              </Badge>
            );
          })}
        </div>
      ),
    },
    { key: "phone", header: t("team.table.phone"), render: (row) => row.phone || "–" },
    {
      key: "status",
      header: t("team.table.status"),
      render: (row) => (
        <Badge variant={row.accountIsActive ? "success" : "secondary"} appearance="subtle">
          {row.accountIsActive ? t("team.status.active") : t("team.status.inactive")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("team.table.actions"),
      headerClassName: "text-end",
      className: "text-end",
      render: (row) => (
        <RowActionsMenu
          ariaLabel={t("team.table.actions")}
          actions={[
            {
              key: "edit",
              label: t("common.edit"),
              icon: "ri-pencil-fill",
              onClick: () => navigate(`/club/team/${row.id}/edit`),
            },
            {
              key: "toggleActive",
              label: row.accountIsActive
                ? t("team.deactivateMember")
                : t("team.activateMember"),
              icon: row.accountIsActive ? "ri-close-circle-line" : "ri-checkbox-circle-line",
              variant: row.accountIsActive ? "danger" : "default",
              onClick: () => setMemberToToggle(row),
            },
          ]}
        />
      ),
    },
  ];

  const noClub = membersQuery.error instanceof ApiError && membersQuery.error.status === 403;

  const members = membersQuery.data?.results ?? [];
  const totalCount = membersQuery.data?.count ?? 0;

  return (
    <>
      <Breadcrumbs title={t("sidebar.team")} />

      <Card>
        <CardHeader
          title={t("sidebar.team")}
          actions={
            !noClub && (
              <Button
                variant="primary"
                leftIcon={<i className="ri-add-line align-bottom" />}
                onClick={() => navigate("/club/team/create")}
              >
                {t("team.createMember")}
              </Button>
            )
          }
        />
        <CardBody>
          {noClub ? (
            <p className="text-muted mb-0">{t("team.noClubMessage")}</p>
          ) : (
            <>
              <div className="search-box mb-4" style={{ maxWidth: 260 }}>
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder={t("team.filters.searchPlaceholder")}
                  aria-label={t("team.filters.searchPlaceholder")}
                  containerClassName="mb-0"
                />
                <i className="ri-search-line search-icon" aria-hidden="true" />
              </div>

              {membersQuery.isError ? (
                <div className="alert alert-danger d-flex align-items-center justify-content-between">
                  <span>{t("common.loadError")}</span>
                  <Button
                    variant="danger"
                    appearance="outline"
                    size="sm"
                    onClick={() => membersQuery.refetch()}
                  >
                    {t("common.retry")}
                  </Button>
                </div>
              ) : (
                <>
                  <Table
                    columns={columns}
                    data={members}
                    getRowKey={(row) => row.id}
                    emptyMessage={t("team.empty")}
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
            </>
          )}
        </CardBody>
      </Card>

      <ConfirmDialog
        isOpen={memberToToggle !== null}
        onClose={() => setMemberToToggle(null)}
        onConfirm={() => memberToToggle && toggleActiveMutation.mutate(memberToToggle)}
        loading={toggleActiveMutation.isPending}
        icon={memberToToggle?.accountIsActive ? "ri-error-warning-line" : "ri-checkbox-circle-line"}
        confirmVariant={memberToToggle?.accountIsActive ? "warning" : "success"}
        title={
          memberToToggle?.accountIsActive
            ? t("team.confirmDeactivate.title")
            : t("team.confirmActivate.title")
        }
        message={
          memberToToggle?.accountIsActive
            ? t("team.confirmDeactivate.message")
            : t("team.confirmActivate.message")
        }
        confirmLabel={
          memberToToggle?.accountIsActive
            ? t("team.confirmDeactivate.confirm")
            : t("team.confirmActivate.confirm")
        }
        cancelLabel={t("common.cancel")}
      />
    </>
  );
}

export default TeamPage;
