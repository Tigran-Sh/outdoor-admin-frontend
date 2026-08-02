import { useTranslation } from "react-i18next";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";

function AdminDashboardPage() {
  const { t } = useTranslation();

  return (
    <>
      <Breadcrumbs title={t("sidebar.dashboard")} />
    </>
  );
}

export default AdminDashboardPage;
