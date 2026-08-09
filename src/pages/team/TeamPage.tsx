import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";

import {
  ACTIVITY_TYPES,
  TEAM_ROLES,
  getTeamMemberFullName,
  mockTeamMembers,
  toTeamMemberListItem,
  type TeamMemberListItem,
} from "./TeamPage.data";
import type { TeamMemberFormValues } from "./TeamMember.schema";

type ConfirmActionType = "toggleStatus" | "delete";

interface ConfirmActionState {
  type: ConfirmActionType;
  member: TeamMemberListItem;
}

interface TeamPageLocationState {
  createdMember?: TeamMemberFormValues;
  updatedMember?: TeamMemberFormValues;
  memberId?: string;
}

function TeamPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [members, setMembers] = useState<TeamMemberListItem[]>(() => {
    const state = location.state as TeamPageLocationState | null;

    if (state?.createdMember) {
      return [
        ...mockTeamMembers,
        {
          id: crypto.randomUUID(),
          ...toTeamMemberListItem(state.createdMember),
          joinedDate: new Date().toISOString().slice(0, 10),
        },
      ];
    }

    if (state?.updatedMember && state.memberId) {
      const updatedMember = state.updatedMember;
      const memberId = state.memberId;
      return mockTeamMembers.map((member) =>
        member.id === memberId ? { ...member, ...toTeamMemberListItem(updatedMember) } : member,
      );
    }

    return mockTeamMembers;
  });
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);

  function handleConfirmAction() {
    if (!confirmAction) return;

    if (confirmAction.type === "delete") {
      setMembers((prev) => prev.filter((member) => member.id !== confirmAction.member.id));
    } else {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === confirmAction.member.id
            ? { ...member, isActive: !member.isActive }
            : member,
        ),
      );
    }

    setConfirmAction(null);
  }

  const columns: TableColumn<TeamMemberListItem>[] = [
    {
      key: "name",
      header: t("team.table.name"),
      sortable: true,
      accessor: (row) => getTeamMemberFullName(row),
      render: (row) => (
        <Link to={`/club/team/${row.id}`}>{getTeamMemberFullName(row)}</Link>
      ),
    },
    {
      key: "role",
      header: t("team.table.role"),
      sortable: true,
      accessor: (row) => t(`team.roles.${row.role}`),
      render: (row) => {
        const role = TEAM_ROLES.find((item) => item.id === row.role);
        if (!role) return "—";

        return (
          <Badge variant={role.variant} appearance="subtle">
            {t(`team.roles.${row.role}`)}
          </Badge>
        );
      },
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
    { key: "phone", header: t("team.table.phone") },
    {
      key: "status",
      header: t("team.table.status"),
      sortable: true,
      accessor: (row) => (row.isActive ? t("team.status.active") : t("team.status.inactive")),
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "secondary"} appearance="subtle">
          {row.isActive ? t("team.status.active") : t("team.status.inactive")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("team.table.actions"),
      headerClassName: "text-end",
      className: "text-end",
      render: (row) => (
        <div className="d-flex justify-content-end gap-2">
          <Button
            appearance="soft"
            variant="primary"
            size="sm"
            iconOnly
            aria-label={t("common.edit")}
            onClick={() => navigate(`/club/team/${row.id}/edit`)}
          >
            <i className="ri-pencil-fill" aria-hidden="true" />
          </Button>

          <Button
            appearance="soft"
            variant={row.isActive ? "warning" : "success"}
            size="sm"
            iconOnly
            aria-label={row.isActive ? t("team.deactivateMember") : t("team.activateMember")}
            onClick={() => setConfirmAction({ type: "toggleStatus", member: row })}
          >
            <i
              className={row.isActive ? "ri-close-circle-line" : "ri-checkbox-circle-line"}
              aria-hidden="true"
            />
          </Button>

          <Button
            appearance="soft"
            variant="danger"
            size="sm"
            iconOnly
            aria-label={t("common.delete")}
            onClick={() => setConfirmAction({ type: "delete", member: row })}
          >
            <i className="ri-delete-bin-5-fill" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs title={t("sidebar.team")} />

      <Card>
        <CardHeader
          title={t("sidebar.team")}
          actions={
            <Button
              variant="primary"
              leftIcon={<i className="ri-add-line align-bottom" />}
              onClick={() => navigate("/club/team/create")}
            >
              {t("team.createMember")}
            </Button>
          }
        />
        <CardBody>
          <Table
            columns={columns}
            data={members}
            getRowKey={(row) => row.id}
            emptyMessage={t("team.empty")}
            searchable
            pageSize={5}
            card
          />
        </CardBody>
      </Card>

      <ConfirmDialog
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        icon={
          confirmAction?.type === "delete"
            ? "ri-delete-bin-line"
            : confirmAction?.member.isActive
              ? "ri-error-warning-line"
              : "ri-checkbox-circle-line"
        }
        confirmVariant={
          confirmAction?.type === "delete"
            ? "danger"
            : confirmAction?.member.isActive
              ? "warning"
              : "success"
        }
        title={
          confirmAction?.type === "delete"
            ? t("team.confirmDelete.title")
            : confirmAction?.member.isActive
              ? t("team.confirmDeactivate.title")
              : t("team.confirmActivate.title")
        }
        message={
          confirmAction?.type === "delete"
            ? t("team.confirmDelete.message")
            : confirmAction?.member.isActive
              ? t("team.confirmDeactivate.message")
              : t("team.confirmActivate.message")
        }
        confirmLabel={
          confirmAction?.type === "delete"
            ? t("team.confirmDelete.confirm")
            : confirmAction?.member.isActive
              ? t("team.confirmDeactivate.confirm")
              : t("team.confirmActivate.confirm")
        }
        cancelLabel={t("common.cancel")}
      />
    </>
  );
}

export default TeamPage;
