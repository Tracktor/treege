import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import buttonEn from "@/locales/en/button.json";
import formEn from "@/locales/en/form.json";
import modalEn from "@/locales/en/modal.json";
import translationEn from "@/locales/en/translation.json";
import buttonFr from "@/locales/fr/button.json";
import formFr from "@/locales/fr/form.json";
import modalFr from "@/locales/fr/modal.json";
import translationFr from "@/locales/fr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    load: "languageOnly",
    react: {
      useSuspense: false,
    },
    resources: {
      en: {
        button: buttonEn,
        form: formEn,
        modal: modalEn,
        translation: translationEn,
      },
      fr: {
        button: buttonFr,
        form: formFr,
        modal: modalFr,
        translation: translationFr,
      },
    },
  })
  .then();

export default i18n;
