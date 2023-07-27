import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import BUTTON_EN from "@/locales/en/button-en";
import SNACK_MESSAGE_EN from "@/locales/en/snackMessage-en";
import TRANSLATION_EN from "@/locales/en/translation-en";
import BUTTON_FR from "@/locales/fr/button-fr";
import FORM_FR from "@/locales/fr/form-fr";
import MODAL_FR from "@/locales/fr/modal-fr";
import SNACK_MESSAGE_FR from "@/locales/fr/snackMessage-fr";
import TRANSLATION_FR from "@/locales/fr/translation-fr";

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
      useSuspense: true,
    },
    resources: {
      en: {
        button: BUTTON_EN,
        form: FORM_FR,
        modal: MODAL_FR,
        snackMessage: SNACK_MESSAGE_EN,
        translation: TRANSLATION_EN,
      },
      fr: {
        button: BUTTON_FR,
        form: FORM_FR,
        modal: MODAL_FR,
        snackMessage: SNACK_MESSAGE_FR,
        translation: TRANSLATION_FR,
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
