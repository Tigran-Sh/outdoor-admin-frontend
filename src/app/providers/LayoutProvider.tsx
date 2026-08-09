import { useEffect, useState, type ReactNode } from "react";

import { LayoutContext, type SidebarSize } from "./useLayout";

const TABLET_BREAKPOINT = 1025;
const MOBILE_BREAKPOINT = 767;

interface LayoutProviderProps {
  children: ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const [sidebarSize, setSidebarSize] = useState<SidebarSize>("lg");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-layout", "vertical");
  }, []);

  useEffect(() => {
    if (sidebarSize === "sm") {
      document.documentElement.setAttribute("data-sidebar-size", "sm");
    } else {
      document.documentElement.removeAttribute("data-sidebar-size");
    }
  }, [sidebarSize]);

  useEffect(() => {
    document.body.classList.toggle("vertical-sidebar-enable", isMobileSidebarOpen);
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT) {
        setSidebarSize("sm");
      } else if (width <= MOBILE_BREAKPOINT) {
        setSidebarSize("lg");
        setIsMobileSidebarOpen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function toggleSidebar() {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarSize((prev) => (prev === "lg" ? "sm" : "lg"));
    }
  }

  function closeMobileSidebar() {
    setIsMobileSidebarOpen(false);
  }

  return (
    <LayoutContext.Provider
      value={{ sidebarSize, isMobileSidebarOpen, toggleSidebar, closeMobileSidebar }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
