import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import RowActionsMenu from "@/components/ui/RowActionsMenu/RowActionsMenu";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";

import {
  ACTIVITY_TYPES,
  CLUB_STATUS_BADGE_VARIANT,
  getClubVerificationStatus,
  mockClubs,
  toClubListItem,
  type ClubListItem,
  type ClubVerificationStatus,
} from "./ClubsPage.data";
import type { ClubFormValues } from "./ClubProfile.schema";

type ConfirmActionType = "verify" | "delete";

interface ConfirmActionState {
  type: ConfirmActionType;
  club: ClubListItem;
}

interface ClubsPageLocationState {
  createdClub?: ClubFormValues;
  updatedClub?: ClubFormValues;
  clubId?: string;
}

function ClubsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [clubs, setClubs] = useState<ClubListItem[]>(() => {
    const state = location.state as ClubsPageLocationState | null;

    if (state?.createdClub) {
      return [
        ...mockClubs,
        {
          id: crypto.randomUUID(),
          ...toClubListItem(state.createdClub),
          identityVerified: false,
          paymentVerified: false,
        },
      ];
    }

    if (state?.updatedClub && state.clubId) {
      const updatedClub = state.updatedClub;
      const clubId = state.clubId;
      return mockClubs.map((club) =>
        club.id === clubId ? { ...club, ...toClubListItem(updatedClub) } : club,
      );
    }

    return mockClubs;
  });
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | ClubVerificationStatus
  >("all");

  const statusCounts = useMemo(() => {
    const counts: Record<ClubVerificationStatus, number> = {
      pending: 0,
      identityVerified: 0,
      fullyVerified: 0,
    };
    for (const club of clubs) counts[getClubVerificationStatus(club)] += 1;
    return counts;
  }, [clubs]);

  const filteredClubs = useMemo(
    () =>
      statusFilter === "all"
        ? clubs
        : clubs.filter(
            (club) => getClubVerificationStatus(club) === statusFilter,
          ),
    [clubs, statusFilter],
  );

  function handleConfirmAction() {
    if (!confirmAction) return;

    if (confirmAction.type === "delete") {
      setClubs((prev) =>
        prev.filter((club) => club.id !== confirmAction.club.id),
      );
    } else {
      setClubs((prev) =>
        prev.map((club) =>
          club.id === confirmAction.club.id
            ? { ...club, identityVerified: true }
            : club,
        ),
      );
    }

    setConfirmAction(null);
  }

  const columns: TableColumn<ClubListItem>[] = [
    {
      key: "name",
      header: t("clubs.table.name"),
      sortable: true,
      render: (row) => (
        <Link
          to={`/admin/clubs/${row.id}`}
          className="d-flex align-items-center gap-2"
        >
          <Avatar name={row.name} size="xs" />
          <span className="fw-medium">{row.name}</span>
        </Link>
      ),
    },
    {
      key: "activityTypes",
      header: t("clubs.table.activityTypes"),
      render: (row) => (
        <div className="d-flex flex-wrap gap-1">
          {row.activityTypeIds.map((activityTypeId) => {
            const activityType = ACTIVITY_TYPES.find(
              (item) => item.id === activityTypeId,
            );
            if (!activityType) return null;

            return (
              <Badge
                key={activityTypeId}
                variant={activityType.variant}
                appearance="subtle"
                pill
              >
                <i
                  className={`${activityType.icon} align-middle me-1`}
                  aria-hidden="true"
                />
                {t(`activityTypes.${activityTypeId}`)}
              </Badge>
            );
          })}
        </div>
      ),
    },
    {
      key: "baseRegion",
      header: t("clubs.table.baseRegion"),
      sortable: true,
      accessor: (row) => t(`regions.${row.baseRegion}`),
      render: (row) => t(`regions.${row.baseRegion}`),
    },
    { key: "email", header: t("clubs.table.email") },
    {
      key: "status",
      header: t("clubs.table.status"),
      sortable: true,
      accessor: (row) => getClubVerificationStatus(row),
      render: (row) => {
        const status = getClubVerificationStatus(row);
        return (
          <Badge
            variant={CLUB_STATUS_BADGE_VARIANT[status]}
            appearance="subtle"
            pill
          >
            {t(`clubs.status.${status}`)}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: t("clubs.table.actions"),
      headerClassName: "text-end",
      className: "text-end",
      render: (row) => (
        <RowActionsMenu
          ariaLabel={t("clubs.table.actions")}
          actions={[
            {
              key: "edit",
              label: t("common.edit"),
              icon: "ri-pencil-fill",
              onClick: () => navigate(`/admin/clubs/${row.id}/edit`),
            },
            {
              key: "verify",
              label: t("clubs.verifyIdentity"),
              icon: "ri-checkbox-circle-line",
              hidden: row.identityVerified,
              onClick: () => setConfirmAction({ type: "verify", club: row }),
            },
            {
              key: "delete",
              label: t("common.delete"),
              icon: "ri-delete-bin-5-fill",
              variant: "danger",
              onClick: () => setConfirmAction({ type: "delete", club: row }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs title={t("sidebar.clubs")} />

      <Card>
        <CardHeader
          title={t("sidebar.clubs")}
          actions={
            <Button
              variant="primary"
              leftIcon={<i className="ri-add-line align-bottom" />}
              onClick={() => navigate("/admin/clubs/create")}
            >
              {t("clubs.createClub")}
            </Button>
          }
        />
        <CardBody>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {(
              [
                {
                  key: "all",
                  label: t("clubs.filters.all"),
                  count: clubs.length,
                },
                {
                  key: "fullyVerified",
                  label: t("clubs.status.fullyVerified"),
                  count: statusCounts.fullyVerified,
                },
                {
                  key: "identityVerified",
                  label: t("clubs.status.identityVerified"),
                  count: statusCounts.identityVerified,
                },
                {
                  key: "pending",
                  label: t("clubs.status.pending"),
                  count: statusCounts.pending,
                },
              ] as const
            ).map((tab) => (
              <Button
                key={tab.key}
                type="button"
                size="sm"
                variant={tab.key === "all" ? "primary" : "secondary"}
                appearance={statusFilter === tab.key ? "soft" : "ghost"}
                className="rounded-pill"
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
                <span className="ms-1">{tab.count}</span>
              </Button>
            ))}
          </div>

          <Table
            columns={columns}
            data={filteredClubs}
            getRowKey={(row) => row.id}
            emptyMessage={t("clubs.empty")}
            searchable
            pageSize={5}
            card
            className="bg-light"
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
            : "ri-checkbox-circle-line"
        }
        confirmVariant={confirmAction?.type === "delete" ? "danger" : "success"}
        title={
          confirmAction?.type === "delete"
            ? t("clubs.confirmDelete.title")
            : t("clubs.confirmVerify.title")
        }
        message={
          confirmAction?.type === "delete"
            ? t("clubs.confirmDelete.message")
            : t("clubs.confirmVerify.message")
        }
        confirmLabel={
          confirmAction?.type === "delete"
            ? t("clubs.confirmDelete.confirm")
            : t("clubs.confirmVerify.confirm")
        }
        cancelLabel={t("common.cancel")}
      />
    </>
  );
}

export default ClubsPage;
