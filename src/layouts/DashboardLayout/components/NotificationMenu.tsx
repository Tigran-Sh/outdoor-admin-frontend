import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button/Button";

function NotificationMenu() {
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

  return (
    <div ref={containerRef} className="dropdown topbar-head-dropdown header-item">
      <Button
        type="button"
        appearance="ghost"
        variant="secondary"
        iconOnly
        className="rounded-circle dropdown-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("common.notifications")}
        aria-expanded={isOpen}
      >
        <i className="ri-notification-3-line fs-22" />
      </Button>

      <div className={["dropdown-menu", "dropdown-menu-lg", "dropdown-menu-end", "p-0", isOpen ? "show" : ""].join(" ")}>
        <div className="p-3 border-bottom">
          <h6 className="m-0 fs-16 fw-semibold">{t("common.notifications")}</h6>
        </div>
        <div className="p-4 text-center text-muted">
          <p className="mb-0">{t("common.noNotifications")}</p>
        </div>
      </div>
    </div>
  );
}

export default NotificationMenu;
