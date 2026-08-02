import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { SidebarItemProps } from "./SidebarItem.types";

function SidebarItem({ item, level = 0, onNavigate }: SidebarItemProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!item.items?.length;
  const linkClassName = level === 0 ? "nav-link menu-link" : "nav-link";

  if (hasChildren) {
    return (
      <li className="nav-item">
        <button
          type="button"
          className={`${linkClassName}${isOpen ? "" : " collapsed"}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          data-bs-toggle="collapse"
        >
          {item.icon && <i className={item.icon} />}
          <span>{t(item.labelKey)}</span>
        </button>

        <ul className={`nav nav-sm flex-column menu-dropdown collapse${isOpen ? " show" : ""}`}>
          {item.items!.map((child) => (
            <SidebarItem key={child.key} item={child} level={level + 1} onNavigate={onNavigate} />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="nav-item">
      <NavLink
        to={item.path ?? "#"}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) => `${linkClassName}${isActive ? " active" : ""}`}
      >
        {item.icon && <i className={item.icon} />}
        <span>{t(item.labelKey)}</span>
        {item.badge && (
          <span className={`badge badge-pill bg-${item.badge.variant ?? "primary"}`}>
            {item.badge.text}
          </span>
        )}
      </NavLink>
    </li>
  );
}

export default SidebarItem;
