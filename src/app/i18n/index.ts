import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hy from "./locales/hy.json";
import ru from "./locales/ru.json";
import { defaultLanguage, isLanguageCode } from "./languages";

export const I18N_STORAGE_KEY = "I18N_LANGUAGE";

const resources = {
  en: { translation: en },
  hy: { translation: hy },
  ru: { translation: ru },
};

function getInitialLanguage() {
  if (typeof window === "undefined") return defaultLanguage;

  const stored = window.localStorage.getItem(I18N_STORAGE_KEY);
  return stored && isLanguageCode(stored) ? stored : defaultLanguage;
}

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
