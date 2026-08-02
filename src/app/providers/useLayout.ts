import { createContext, useContext } from "react";

export type SidebarSize = "lg" | "sm";

export interface LayoutContextValue {
  sidebarSize: SidebarSize;
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
