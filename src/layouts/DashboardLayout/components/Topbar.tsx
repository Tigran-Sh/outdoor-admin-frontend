import { useTranslation } from "react-i18next";

import LanguageSwitcher from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher/ThemeSwitcher";

import { useLayout } from "@/app/providers/useLayout";

import UserMenu from "./UserMenu";

interface TopbarProps {
  userName: string;
}

function Topbar({ userName }: TopbarProps) {
  const { t } = useTranslation();
  const { toggleSidebar } = useLayout();

  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
              onClick={toggleSidebar}
              aria-label={t("common.toggleMenu")}
            >
              <span className="hamburger-icon">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

          <div className="d-flex align-items-center">
            <ThemeSwitcher className="header-item" />
            <LanguageSwitcher className="header-item" />
            <UserMenu name={userName} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
