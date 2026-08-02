import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Button from "@/components/ui/Button/Button";

interface UserMenuProps {
  name: string;
}

function UserMenu({ name }: UserMenuProps) {
  const { t } = useTranslation();
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

      <div className={["dropdown-menu", "dropdown-menu-end", isOpen ? "show" : ""].join(" ")}>
        <Link to="/profile" className="dropdown-item" onClick={handleItemClick}>
          <i className="ri-user-line text-muted fs-16 align-middle me-1" />
          <span className="align-middle">{t("common.myProfile")}</span>
        </Link>
        <Link to="/settings" className="dropdown-item" onClick={handleItemClick}>
          <i className="ri-settings-3-line text-muted fs-16 align-middle me-1" />
          <span className="align-middle">{t("common.settings")}</span>
        </Link>
        <div className="dropdown-divider" />
        <button type="button" className="dropdown-item" onClick={handleItemClick}>
          <i className="ri-logout-box-r-line text-muted fs-16 align-middle me-1" />
          <span className="align-middle">{t("common.logout")}</span>
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
