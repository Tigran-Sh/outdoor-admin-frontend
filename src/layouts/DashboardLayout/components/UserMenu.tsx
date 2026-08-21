import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button/Button";

import { useAuth } from "@/app/providers/useAuth";

interface UserMenuProps {
  name: string;
  placement?: "topbar" | "sidebar";
}

function UserMenu({ name, placement = "topbar" }: UserMenuProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleItemClick() {
    setIsOpen(false);
  }

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    navigate("/", { replace: true });
  }

  const menuItems = (
    <>
      <Link to="/profile" className="dropdown-item" onClick={handleItemClick}>
        <i className="ri-user-line text-muted fs-16 align-middle me-1" />
        <span className="align-middle">{t("common.myProfile")}</span>
      </Link>
      <Link to="/settings" className="dropdown-item" onClick={handleItemClick}>
        <i className="ri-settings-3-line text-muted fs-16 align-middle me-1" />
        <span className="align-middle">{t("common.settings")}</span>
      </Link>
      <div className="dropdown-divider" />
      <button type="button" className="dropdown-item" onClick={handleLogout}>
        <i className="ri-logout-box-r-line text-muted fs-16 align-middle me-1" />
        <span className="align-middle">{t("common.logout")}</span>
      </button>
    </>
  );

  if (placement === "sidebar") {
    return (
      <div ref={containerRef} className="dropdown dropup sidebar-user">
        <Button
          type="button"
          appearance="ghost"
          variant="secondary"
          className="dropdown-toggle sidebar-user-toggle w-100 d-flex align-items-center justify-content-between"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <span className="d-flex align-items-center gap-2 overflow-hidden">
            <span
              className="avatar-xs rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
              aria-hidden="true"
            >
              <i className="ri-user-line" />
            </span>
            <span className="text-start overflow-hidden">
              <span className="d-block fw-medium user-name-text text-truncate">{name}</span>
              {user && (
                <span className="d-block fs-12 text-muted text-truncate">
                  {t(`admin.roleNames.${user.role}`)}
                </span>
              )}
            </span>
          </span>
        </Button>

        <div
          className={["dropdown-menu", isOpen ? "show" : ""].join(" ")}
          data-bs-popper="static"
        >
          {menuItems}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="dropdown ms-sm-3 header-item topbar-user">
      <Button
        type="button"
        appearance="ghost"
        variant="secondary"
        className="dropdown-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="d-flex align-items-center">
          <span
            className="avatar-xs rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
            aria-hidden="true"
          >
            <i className="ri-user-line" />
          </span>
          <span className="text-start ms-2">
            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{name}</span>
          </span>
        </span>
      </Button>

      <div
        className={["dropdown-menu", "dropdown-menu-end", isOpen ? "show" : ""].join(" ")}
        data-bs-popper="static"
      >
        {menuItems}
      </div>
    </div>
  );
}

export default UserMenu;
