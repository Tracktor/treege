export const LANGUAGES = {
  ar: "ar",
  de: "de",
  en: "en",
  es: "es",
  fr: "fr",
  it: "it",
  pt: "pt",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
