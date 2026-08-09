import type { ButtonVariant } from "@/components/ui/Button/Button.types";

export interface SidebarNavBadge {
  text: string;
  variant?: ButtonVariant;
}

export interface SidebarNavItem {
  key: string;
  labelKey: string;
  path?: string;
  icon?: string;
  end?: boolean;
  badge?: SidebarNavBadge;
  items?: SidebarNavItem[];
}

export interface SidebarNavSection {
  key: string;
  titleKey?: string;
  items: SidebarNavItem[];
}

export interface SidebarNavProps {
  sections: SidebarNavSection[];
  onNavigate?: () => void;
}
