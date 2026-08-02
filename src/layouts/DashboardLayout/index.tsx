import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LayoutProvider } from "@/app/providers";
import { useLayout } from "@/app/providers/useLayout";

import { platformAdminMenu } from "./menus/platformAdminMenu";
import { clubOwnerMenu } from "./menus/clubOwnerMenu";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function DashboardShell() {
  const { t } = useTranslation();
  const { closeMobileSidebar } = useLayout();
  const { pathname } = useLocation();

  // TODO: derive from the authenticated user's role once auth lands (Step 8).
  const sections = pathname.startsWith("/club") ? clubOwnerMenu : platformAdminMenu;

  return (
    <div id="layout-wrapper">
      <Topbar userName={t("common.myAccount")} />
      <Sidebar sections={sections} onNavigate={closeMobileSidebar} />

      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardLayout() {
  return (
    <LayoutProvider>
      <DashboardShell />
    </LayoutProvider>
  );
}

export default DashboardLayout;
