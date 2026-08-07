import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";

import ClubFormModal from "./components/ClubFormModal";
import {
  ACTIVITY_TYPES,
  CLUB_STATUS_BADGE_VARIANT,
  getClubVerificationStatus,
  mockClubs,
  type ClubListItem,
} from "./ClubsPage.data";
import type { ClubFormValues } from "./ClubProfile.schema";

type ConfirmActionType = "verify" | "delete";

interface ConfirmActionState {
  type: ConfirmActionType;
  club: ClubListItem;
}

interface ClubsPageLocationState {
  createdClub?: ClubFormValues;
}

function toClubFormValues(club: ClubListItem): ClubFormValues {
  return {
    name: club.name,
    logo: club.logo,
    coverImage: club.coverImage,
    about: club.about,
    activityTypeIds: club.activityTypeIds,
    baseRegion: club.baseRegion,
    yearFounded: club.yearFounded,
    email: club.email,
    phone: club.phone,
    instagram: club.instagram,
    facebook: club.facebook,
    telegram: club.telegram,
    website: club.website,
    entityType: club.entityType,
    taxId: club.taxId,
    ownerIdDocument: club.ownerIdDocument,
  };
}

function toClubListItem(values: ClubFormValues): Omit<ClubListItem, "id" | "identityVerified" | "paymentVerified"> {
  return {
    name: values.name,
    logo: values.logo,
    coverImage: values.coverImage,
    about: values.about,
    activityTypeIds: values.activityTypeIds,
    baseRegion: values.baseRegion as ClubListItem["baseRegion"],
    yearFounded: values.yearFounded,
    email: values.email,
    phone: values.phone,
    instagram: values.instagram,
    facebook: values.facebook,
    telegram: values.telegram,
    website: values.website,
    entityType: values.entityType as ClubListItem["entityType"],
    taxId: values.taxId,
    ownerIdDocument: values.ownerIdDocument,
  };
}

function ClubsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [clubs, setClubs] = useState<ClubListItem[]>(() => {
    const state = location.state as ClubsPageLocationState | null;
    const createdClub = state?.createdClub;
    if (!createdClub) return mockClubs;

    return [
      ...mockClubs,
      {
        id: crypto.randomUUID(),
        ...toClubListItem(createdClub),
        identityVerified: false,
        paymentVerified: false,
      },
    ];
  });
  const [editingClub, setEditingClub] = useState<ClubListItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);

  function handleUpdateClub(values: ClubFormValues) {
    setClubs((prev) =>
      prev.map((club) =>
        editingClub && club.id === editingClub.id ? { ...club, ...toClubListItem(values) } : club,
      ),
    );
    setEditingClub(null);
  }

  function handleConfirmAction() {
    if (!confirmAction) return;

    if (confirmAction.type === "delete") {
      setClubs((prev) => prev.filter((club) => club.id !== confirmAction.club.id));
    } else {
      setClubs((prev) =>
        prev.map((club) =>
          club.id === confirmAction.club.id ? { ...club, identityVerified: true } : club,
        ),
      );
    }

    setConfirmAction(null);
  }

  const columns: TableColumn<ClubListItem>[] = [
    { key: "name", header: t("clubs.table.name"), sortable: true },
    {
      key: "activityTypes",
      header: t("clubs.table.activityTypes"),
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
          <Badge variant={CLUB_STATUS_BADGE_VARIANT[status]} appearance="subtle">
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
        <div className="d-flex justify-content-end gap-2">
          <Button
            appearance="soft"
            variant="primary"
            size="sm"
            iconOnly
            aria-label={t("common.edit")}
            onClick={() => setEditingClub(row)}
          >
            <i className="ri-pencil-fill" aria-hidden="true" />
          </Button>

          {!row.identityVerified && (
            <Button
              appearance="soft"
              variant="success"
              size="sm"
              iconOnly
              aria-label={t("clubs.verifyIdentity")}
              onClick={() => setConfirmAction({ type: "verify", club: row })}
            >
              <i className="ri-checkbox-circle-line" aria-hidden="true" />
            </Button>
          )}

          <Button
            appearance="soft"
            variant="danger"
            size="sm"
            iconOnly
            aria-label={t("common.delete")}
            onClick={() => setConfirmAction({ type: "delete", club: row })}
          >
            <i className="ri-delete-bin-5-fill" aria-hidden="true" />
          </Button>
        </div>
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
          <Table
            columns={columns}
            data={clubs}
            getRowKey={(row) => row.id}
            emptyMessage={t("clubs.empty")}
            searchable
            pageSize={5}
            card
          />
        </CardBody>
      </Card>

      {editingClub && (
        <ClubFormModal
          key={editingClub.id}
          isOpen
          initialValues={toClubFormValues(editingClub)}
          onClose={() => setEditingClub(null)}
          onSubmit={handleUpdateClub}
        />
      )}

      <ConfirmDialog
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        icon={confirmAction?.type === "delete" ? "ri-delete-bin-line" : "ri-checkbox-circle-line"}
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
