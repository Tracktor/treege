import { LANGUAGES } from "@/shared/constants/languages";

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
