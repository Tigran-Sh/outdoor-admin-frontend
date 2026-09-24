/**
 * Common spoken/working languages offered across the app. A guide's own "Working Languages"
 * (team member profile) and an event's "Guide Working Languages" are both chosen from this same
 * list, so an event can never require a language no guide actually speaks.
 *
 * Not to be confused with `LanguageCode` in `@/app/i18n/languages`, which is the *interface*
 * language (en/hy/ru only) the admin UI itself is translated into.
 *
 * Each code needs a translated display name at `events.languages.<code>` in all three
 * `src/app/i18n/locales/*.json` files.
 */
export const LANGUAGES = [
  "en",
  "hy",
  "ru",
  "fr",
  "de",
  "es",
  "it",
  "pt",
  "nl",
  "pl",
  "tr",
  "ar",
  "fa",
  "he",
  "ka",
  "el",
  "zh",
  "ja",
  "ko",
  "hi",
  "uk",
  "ro",
  "bg",
  "cs",
  "sv",
  "fi",
  "da",
  "hu",
  "az",
] as const;

export type SpokenLanguage = (typeof LANGUAGES)[number];
