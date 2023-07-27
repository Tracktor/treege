import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import buttonEn from "@/locales/en/button-en";
import formEn from "@/locales/en/form-en";
import modalEn from "@/locales/en/modal-en";
import snackMessageEn from "@/locales/en/snackMessage-en";
import translationEn from "@/locales/en/translation-en";
import buttonFr from "@/locales/fr/button-fr";
import formFr from "@/locales/fr/form-fr";
import modalFr from "@/locales/fr/modal-fr";
import snackMessageFr from "@/locales/fr/snackMessage-fr";
import translationFr from "@/locales/fr/translation-fr";

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
        snackMessage: snackMessageEn,
        translation: translationEn,
      },
      fr: {
        button: buttonFr,
        form: formFr,
        modal: modalFr,
        snackMessage: snackMessageFr,
        translation: translationFr,
      },
    },
    returnNull: false,
  })
  .then(() => {
    if (document.documentElement.lang === i18n.resolvedLanguage) {
      return;
    }

    if (i18n.resolvedLanguage) {
      document.documentElement.setAttribute("lang", i18n.resolvedLanguage);
    }
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
});

export default i18n;
