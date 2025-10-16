/**
 * A type representing a label that can be translated into multiple languages.
 * The keys are language codes (e.g., 'en' for English, 'fr' for French),
 * and the values are the corresponding translations.
 */
export interface TranslatableLabel {
  en?: string;
  [key: string]: string | undefined;
}
