import { LANGUAGES } from "@/shared/constants/languages";

/**
 * Type representing supported languages
 */
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
