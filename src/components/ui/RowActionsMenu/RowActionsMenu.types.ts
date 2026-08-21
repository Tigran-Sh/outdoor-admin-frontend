export interface RowAction {
  key: string;
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: "default" | "danger";
  hidden?: boolean;
}

export interface RowActionsMenuProps {
  actions: RowAction[];
  ariaLabel: string;
}
