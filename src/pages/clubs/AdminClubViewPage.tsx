import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";

import ClubProfileView from "./components/ClubProfileView";
import { getClubById } from "./ClubsPage.data";

function AdminClubViewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const club = id ? getClubById(id) : undefined;

  if (!club) {
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

  return (
    <>
      <Breadcrumbs
        title={club.name}
        items={[{ label: t("sidebar.clubs"), to: "/admin/clubs" }]}
      />

      <ClubProfileView
        club={club}
        editHref={`/admin/clubs/${club.id}/edit`}
        editLabel={t("clubs.view.editClub")}
      />
    </>
  );
}

export default AdminClubViewPage;
