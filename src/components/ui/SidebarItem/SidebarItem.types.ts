import type { SidebarNavItem } from "@/components/ui/SidebarNav/SidebarNav.types";

export interface SidebarItemProps {
  item: SidebarNavItem;
  level?: number;
  onNavigate?: () => void;
}
