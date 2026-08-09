import SidebarGroup from "@/components/ui/SidebarGroup/SidebarGroup";
import SidebarItem from "@/components/ui/SidebarItem/SidebarItem";

import type { SidebarNavProps } from "./SidebarNav.types";

function SidebarNav({ sections, onNavigate }: SidebarNavProps) {
  return (
    <ul className="navbar-nav" id="navbar-nav">
      {sections.map((section) => (
        <SidebarGroup key={section.key} titleKey={section.titleKey}>
          {section.items.map((item) => (
            <SidebarItem key={item.key} item={item} onNavigate={onNavigate} />
          ))}
        </SidebarGroup>
      ))}
    </ul>
  );
}

export default SidebarNav;
