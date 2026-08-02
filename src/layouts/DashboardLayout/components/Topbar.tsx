import { useTranslation } from "react-i18next";

import LanguageSwitcher from "@/components/ui/LanguageSwitcher/LanguageSwitcher";

import { useLayout } from "@/app/providers/useLayout";

import NotificationMenu from "./NotificationMenu";
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

            <form className="app-search d-none d-md-block" role="search">
              <div className="position-relative">
                <input
                  type="search"
                  className="form-control"
                  placeholder={t("common.searchPlaceholder")}
                  aria-label={t("common.search")}
                />
                <span className="ri-search-line search-widget-icon" aria-hidden="true" />
              </div>
            </form>
          </div>

          <div className="d-flex align-items-center">
            <LanguageSwitcher className="header-item" />
            <NotificationMenu />
            <UserMenu name={userName} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
