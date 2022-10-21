import type { SnackbarState } from "@/context/Snackbar/SnackbarContext";

export const snackbarReducerActionType = {
  closeSnackbar: "closeSnackbar",
  openSnackbar: "openSnackbar",
} as const;

export const openSnackbar = (message: SnackbarState["message"], severity: SnackbarState["severity"] = "success") => ({
  message,
  severity,
  type: snackbarReducerActionType.openSnackbar,
});

export const closeSnackbar = () => ({
  type: snackbarReducerActionType.closeSnackbar,
});

const snackbarReducer = (snackbar: SnackbarState, action: any) => {
  switch (action.type) {
    case snackbarReducerActionType.openSnackbar: {
      const { message, severity } = action;

      return { message, open: true, severity };
    }

    case snackbarReducerActionType.closeSnackbar: {
      return { ...snackbar, open: false };
    }

    default:
      throw new Error();
  }
};

export default snackbarReducer;
