/**
 * A type representing a string that can be translated into multiple languages.
 * The keys are language codes (e.g., 'en' for English, 'fr' for French),
 * and the values are the corresponding translations.
 */
export interface Translatable {
  en?: string;
  [key: string]: string | undefined;
}
