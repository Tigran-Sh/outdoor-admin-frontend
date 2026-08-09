import { useTranslation } from "react-i18next";

import type { SidebarGroupProps } from "./SidebarGroup.types";

function SidebarGroup({ titleKey, children }: SidebarGroupProps) {
  const { t } = useTranslation();

  return (
    <>
      {titleKey && (
        <li className="menu-title">
          <span>{t(titleKey)}</span>
        </li>
      )}
      {children}
    </>
  );
}

export default SidebarGroup;
