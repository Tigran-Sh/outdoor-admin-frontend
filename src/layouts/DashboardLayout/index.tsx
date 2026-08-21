import { Outlet } from "react-router-dom";

import { LayoutProvider } from "@/app/providers";
import { useLayout } from "@/app/providers/useLayout";
import { useAuth } from "@/app/providers/useAuth";

import { platformAdminMenu } from "./menus/platformAdminMenu";
import { clubOwnerMenu } from "./menus/clubOwnerMenu";
import { guideStaffMenu } from "./menus/guideStaffMenu";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import type { SidebarNavSection } from "@/components/ui/SidebarNav/SidebarNav.types";
import type { Role } from "@/types/auth";

const MENU_BY_ROLE: Record<Role, SidebarNavSection[]> = {
  platform_admin: platformAdminMenu,
  internal_admin: platformAdminMenu,
  club_owner: clubOwnerMenu,
  guide: guideStaffMenu,
  participant: clubOwnerMenu,
};

function DashboardShell() {
  const { closeMobileSidebar } = useLayout();
  const { user } = useAuth();

  const sections = MENU_BY_ROLE[user?.role ?? "club_owner"];

  return (
    <div id="layout-wrapper">
      <Topbar />
      <Sidebar sections={sections} userName={user?.full_name ?? ""} onNavigate={closeMobileSidebar} />

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
