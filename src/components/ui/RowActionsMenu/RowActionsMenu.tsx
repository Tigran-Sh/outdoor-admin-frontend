import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

import Button from "@/components/ui/Button/Button";

import type { RowActionsMenuProps } from "./RowActionsMenu.types";

function RowActionsMenu({ actions, ariaLabel }: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Table rows sit inside a `.table-responsive`/`.table-card` scroll
  // container, which (per the CSS overflow spec, setting overflow-x: auto
  // implicitly forces overflow-y to auto too when it isn't set explicitly)
  // clips anything that tries to render past its bottom edge -- including a
  // dropdown menu opening below one of the last rows, which is exactly what
  // was happening here. `position: fixed` escapes that clipping ancestor
  // entirely, so the menu's position is computed here (viewport coordinates,
  // flipping upward if there isn't room below) instead of relying on
  // Bootstrap's CSS-only `top: 100%` / `.dropup` positioning.
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? 0;
    const spacing = 4;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const openUpward = spaceBelow < menuHeight + spacing && triggerRect.top > menuHeight + spacing;

    setMenuStyle({
      position: "fixed",
      top: openUpward ? undefined : triggerRect.bottom + spacing,
      bottom: openUpward ? window.innerHeight - triggerRect.top + spacing : undefined,
      right: window.innerWidth - triggerRect.right,
      left: "auto",
    });
  }, [isOpen]);

  const visibleActions = actions.filter((action) => !action.hidden);
  if (visibleActions.length === 0) return null;

  return (
    <div ref={containerRef} className="dropdown">
      <Button
        ref={triggerRef}
        type="button"
        appearance="ghost"
        variant="secondary"
        size="sm"
        iconOnly
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <i className="ri-more-2-fill" aria-hidden="true" />
      </Button>

      <div
        ref={menuRef}
        className={["dropdown-menu", isOpen ? "show" : ""].join(" ")}
        style={isOpen ? menuStyle : undefined}
      >
        {visibleActions.map((action) => (
          <button
            key={action.key}
            type="button"
            className={`dropdown-item${action.variant === "danger" ? " text-danger" : ""}`}
            onClick={() => {
              setIsOpen(false);
              action.onClick();
            }}
          >
            {action.icon && (
              <i
                className={`${action.icon} ${action.variant === "danger" ? "" : "text-muted"} fs-16 align-middle me-2`}
                aria-hidden="true"
              />
            )}
            <span className="align-middle">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RowActionsMenu;
