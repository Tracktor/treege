import type { FlashMessageState } from "@/context/FlashMessage/FlashMessageContext";

export const flashMessageReducerActionType = {
  closeFlashMessage: "closeFlashMessage",
  openFlashMessage: "openFlashMessage",
} as const;

export const openFlashMessage = (message: FlashMessageState["message"], severity: FlashMessageState["severity"] = "success") => ({
  message,
  severity,
  type: flashMessageReducerActionType.openFlashMessage,
});

export const closeFlashMessage = () => ({
  type: flashMessageReducerActionType.closeFlashMessage,
});

const flashMessageReducer = (flashMessage: FlashMessageState, action: any) => {
  switch (action.type) {
    case flashMessageReducerActionType.openFlashMessage: {
      const { message, severity } = action;

      return { message, open: true, severity };
    }

    case flashMessageReducerActionType.closeFlashMessage: {
      return { ...flashMessage, open: false };
    }

    default:
      throw new Error();
  }
};

export default flashMessageReducer;
