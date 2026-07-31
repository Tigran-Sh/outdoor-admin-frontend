import flagEn from "@/assets/images/flags/us.svg";
import flagHy from "@/assets/images/flags/am.svg";
import flagRu from "@/assets/images/flags/ru.svg";

export type LanguageCode = "en" | "hy" | "ru";

export interface LanguageMeta {
  label: string;
  flag: string;
}

export const defaultLanguage: LanguageCode = "en";

export const languages: Record<LanguageCode, LanguageMeta> = {
  en: { label: "English", flag: flagEn },
  hy: { label: "Հայերեն", flag: flagHy },
  ru: { label: "Русский", flag: flagRu },
};

export function isLanguageCode(value: string): value is LanguageCode {
  return value in languages;
}
