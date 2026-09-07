import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody } from "@/components/ui/Card/Card";

import { getMyClub } from "@/services/clubs.api";
import { ApiError } from "@/types/apiError";

import ClubProfileView from "./components/ClubProfileView";

function ClubViewPage() {
  const { t } = useTranslation();
  const clubQuery = useQuery({ queryKey: ["my-club"], queryFn: getMyClub, retry: false });

  if (clubQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const notFound = clubQuery.error instanceof ApiError && clubQuery.error.status === 404;

  if (notFound) {
    return (
      <>
        <Breadcrumbs title={t("sidebar.clubProfile")} />
        <Card>
          <CardBody>
            <p className="text-muted mb-0">{t("clubs.view.noClubMessage")}</p>
          </CardBody>
        </Card>
      </>
    );
  }

  if (clubQuery.isError || !clubQuery.data) {
    return (
      <div className="alert alert-danger d-flex align-items-center justify-content-between">
        <span>{t("common.loadError")}</span>
        <Button variant="danger" appearance="outline" size="sm" onClick={() => clubQuery.refetch()}>
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs title={clubQuery.data.name} />

      <ClubProfileView
        club={clubQuery.data}
        editHref="/club/profile/edit"
        editLabel={t("clubs.view.editProfile")}
        canViewIdDocument
      />
    </>
  );
}

export default ClubViewPage;
