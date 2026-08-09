import { useTranslation } from "react-i18next";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";

import ClubProfileView from "./components/ClubProfileView";
import { mockClubs } from "./ClubsPage.data";

const myClub = mockClubs[0];

function ClubViewPage() {
  const { t } = useTranslation();

  return (
    <>
      <Breadcrumbs title={myClub.name} />

      <ClubProfileView
        club={myClub}
        editHref="/club/profile/edit"
        editLabel={t("clubs.view.editProfile")}
      />
    </>
  );
}

export default ClubViewPage;
