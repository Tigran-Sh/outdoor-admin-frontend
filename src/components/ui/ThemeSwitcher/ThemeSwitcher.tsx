import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button/Button";
import { useTheme } from "@/app/providers/useTheme";

import type { ThemeSwitcherProps } from "./ThemeSwitcher.types";

function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      appearance="ghost"
      variant="secondary"
      iconOnly
      className={["rounded-circle", className].filter(Boolean).join(" ")}
      style={{ width: 40, height: 40 }}
      onClick={toggleTheme}
      aria-label={isDark ? t("common.switchToLightMode") : t("common.switchToDarkMode")}
    >
      <i className={isDark ? "ri-sun-line" : "ri-moon-line"} aria-hidden="true" />
    </Button>
  );
}

export default ThemeSwitcher;
