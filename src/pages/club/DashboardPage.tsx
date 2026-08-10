import { useTranslation } from "react-i18next";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";

import EventsStatistics from "./components/EventsStatistics";

function ClubDashboardPage() {
  const { t } = useTranslation();

  return (
    <>
      <Breadcrumbs title={t("sidebar.dashboard")} />

      <EventsStatistics />
    </>
  );
}

export default ClubDashboardPage;
