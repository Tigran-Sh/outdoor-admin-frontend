import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SidebarNav from "@/components/ui/SidebarNav/SidebarNav";
import type { SidebarNavSection } from "@/components/ui/SidebarNav/SidebarNav.types";

import { useAuth } from "@/app/providers/useAuth";

import logoDark from "@/assets/images/logo.svg";
import logoLight from "@/assets/images/logo-light.png";
import logoSm from "@/assets/images/logo.svg";

import UserMenu from "./UserMenu";

interface SidebarProps {
  sections: SidebarNavSection[];
  userName: string;
  onNavigate?: () => void;
}

function Sidebar({ sections, userName, onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="" height={22} />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" height={26} />
              <span className={"logo-text"}>Odex</span>
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoSm} alt="" height={22} />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" height={26} />
            </span>
          </Link>
        </div>

        {user && (
          <div className="sidebar-role-badge pb-3 px-3">
            <span className="badge rounded-pill bg-secondary-subtle text-secondary">
              {t(`admin.roleNames.${user.role}`)}
            </span>
          </div>
        )}

        <div id="scrollbar" className="h-100" style={{ overflowY: "auto" }}>
          <div className="container-fluid">
            <SidebarNav sections={sections} onNavigate={onNavigate} />
          </div>
        </div>

        <div className="sidebar-background" />

        <div className="sidebar-user-footer">
          <UserMenu name={userName} placement="sidebar" />
        </div>
      </div>

      <div className="vertical-overlay" onClick={onNavigate} />
    </>
  );
}

export default Sidebar;
