import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";

import { getAdminClub } from "@/services/clubs.api";

import ClubProfileView from "./components/ClubProfileView";

function AdminClubViewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const clubQuery = useQuery({
    queryKey: ["admin-club", id],
    queryFn: () => getAdminClub(id as string),
    enabled: Boolean(id),
    retry: false,
  });

  if (clubQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (clubQuery.isError || !clubQuery.data) {
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

  const club = clubQuery.data;

  return (
    <>
      <Breadcrumbs
        title={club.name}
        items={[{ label: t("sidebar.clubs"), to: "/admin/clubs" }]}
      />

      <ClubProfileView club={club} canViewIdDocument />
    </>
  );
}

export default AdminClubViewPage;
