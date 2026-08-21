import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button/Button";
import { I18N_STORAGE_KEY } from "@/app/i18n";
import { defaultLanguage, isLanguageCode, languages, type LanguageCode } from "@/app/i18n/languages";

import type { LanguageSwitcherProps } from "./LanguageSwitcher.types";

function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage: LanguageCode = isLanguageCode(i18n.language)
    ? i18n.language
    : defaultLanguage;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(code: LanguageCode) {
    void i18n.changeLanguage(code);
    window.localStorage.setItem(I18N_STORAGE_KEY, code);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={["dropdown", className].filter(Boolean).join(" ")}>
      <Button
        type="button"
        appearance="ghost"
        variant="secondary"
        iconOnly
        className="rounded-circle dropdown-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("common.language")}
        aria-expanded={isOpen}
      >
        <img
          src={languages[currentLanguage].flag}
          alt={languages[currentLanguage].label}
          height={20}
          className="rounded"
        />
      </Button>

      <div
        className={["dropdown-menu", "dropdown-menu-end", isOpen ? "show" : ""].join(" ")}
        data-bs-popper="static"
      >
        {(Object.keys(languages) as LanguageCode[]).map((code) => (
          <button
            key={code}
            type="button"
            className={`dropdown-item${code === currentLanguage ? " active" : ""}`}
            onClick={() => handleSelect(code)}
          >
            <img src={languages[code].flag} alt={languages[code].label} height={18} className="me-2 rounded" />
            <span className="align-middle">{languages[code].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
