import buttonEn from "@/locales/en/button-en";
import formEn from "@/locales/en/form-en";
import modalEn from "@/locales/en/modal-en";
import snackMessageEn from "@/locales/en/snackMessage-en";
import translationEn from "@/locales/en/translation-en";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: "translation";
    resources: {
      button: typeof buttonEn;
      form: typeof formEn;
      modal: typeof modalEn;
      snackMessage: typeof snackMessageEn;
      translation: typeof translationEn;
    };
  }
}
