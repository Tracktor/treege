import BUTTON_EN from "@/locales/en/button-en";
import FORM_EN from "@/locales/en/form-en";
import MODAL_EN from "@/locales/en/modal-en";
import SNACK_MESSAGE_EN from "@/locales/en/snackMessage-en";
import TRANSLATION_EN from "@/locales/en/translation-en";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    resources: {
      button: typeof BUTTON_EN;
      form: typeof FORM_EN;
      modal: typeof MODAL_EN;
      snackMessage: typeof SNACK_MESSAGE_EN;
      translation: typeof TRANSLATION_EN;
    };
  }
}
