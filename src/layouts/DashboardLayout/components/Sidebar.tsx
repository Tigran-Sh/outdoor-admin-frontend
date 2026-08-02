import { Link } from "react-router-dom";

import SidebarNav from "@/components/ui/SidebarNav/SidebarNav";
import type { SidebarNavSection } from "@/components/ui/SidebarNav/SidebarNav.types";

import logoDark from "@/assets/images/logo-dark.png";
import logoLight from "@/assets/images/logo-light.png";
import logoSm from "@/assets/images/logo-sm.png";

interface SidebarProps {
  sections: SidebarNavSection[];
  onNavigate?: () => void;
}

function Sidebar({ sections, onNavigate }: SidebarProps) {
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

        <div id="scrollbar" className="h-100" style={{ overflowY: "auto" }}>
          <div className="container-fluid">
            <SidebarNav sections={sections} onNavigate={onNavigate} />
          </div>
        </div>

        <div className="sidebar-background" />
      </div>

      <div className="vertical-overlay" onClick={onNavigate} />
    </>
  );
}

export default Sidebar;
