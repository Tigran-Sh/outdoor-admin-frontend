import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";

import { getAdminClub, setClubStatus } from "@/services/clubs.api";

import ClubProfileView from "./components/ClubProfileView";

function AdminClubViewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [isConfirmingToggle, setIsConfirmingToggle] = useState(false);

  const clubQuery = useQuery({
    queryKey: ["admin-club", id],
    queryFn: () => getAdminClub(id as string),
    enabled: Boolean(id),
    retry: false,
  });
  const club = clubQuery.data;

  const toggleStatusMutation = useMutation({
    mutationFn: () =>
      setClubStatus(id as string, club?.status === "suspended" ? "approved" : "suspended"),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin-club", id], updated);
      setIsConfirmingToggle(false);
    },
  });

  if (clubQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (clubQuery.isError || !club) {
    return (
      <>
        <Breadcrumbs
          title={t("clubs.view.notFound")}
          items={[{ label: t("sidebar.clubs"), to: "/admin/clubs" }]}
        />

        <Card>
          <CardBody>
            <p className="text-muted mb-3">{t("clubs.view.notFoundMessage")}</p>
            <Link to="/admin/clubs" className="btn btn-primary">
              {t("clubs.view.backToClubs")}
            </Link>
          </CardBody>
        </Card>
      </>
    );
  }

  const isSuspended = club.status === "suspended";

  return (
    <>
      <Breadcrumbs
        title={club.name}
        items={[{ label: t("sidebar.clubs"), to: "/admin/clubs" }]}
      />

      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className={isSuspended ? "btn btn-outline-success" : "btn btn-outline-danger"}
          onClick={() => setIsConfirmingToggle(true)}
        >
          <i
            className={`${isSuspended ? "ri-checkbox-circle-line" : "ri-forbid-line"} align-bottom me-1`}
            aria-hidden="true"
          />
          {isSuspended ? t("clubs.activateClub") : t("clubs.deactivateClub")}
        </button>
      </div>

      <ClubProfileView
        club={club}
        editHref={`/admin/clubs/${club.id}/edit`}
        editLabel={t("clubs.view.editClub")}
        canViewIdDocument
      />

      <ConfirmDialog
        isOpen={isConfirmingToggle}
        onClose={() => setIsConfirmingToggle(false)}
        onConfirm={() => toggleStatusMutation.mutate()}
        loading={toggleStatusMutation.isPending}
        icon={isSuspended ? "ri-checkbox-circle-line" : "ri-forbid-line"}
        confirmVariant={isSuspended ? "success" : "danger"}
        title={isSuspended ? t("clubs.confirmActivate.title") : t("clubs.confirmDeactivate.title")}
        message={
          isSuspended ? t("clubs.confirmActivate.message") : t("clubs.confirmDeactivate.message")
        }
        confirmLabel={
          isSuspended ? t("clubs.confirmActivate.confirm") : t("clubs.confirmDeactivate.confirm")
        }
        cancelLabel={t("common.cancel")}
      />
    </>
  );
}

export default AdminClubViewPage;
