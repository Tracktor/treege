import { createContext, ReducerAction } from "react";

type Severity = "error" | "warning" | "info" | "success";

export interface SnackbarState {
  open: boolean;
  message?: string;
  severity?: Severity;
}

export interface SnackbarValue {
  snackbar: SnackbarState;
  dispatchSnackbar(state: ReducerAction<any>): void;
}

export const snackbarDefaultValue = {
  dispatchSnackbar: () => null,
  snackbar: { open: false },
};

export const SnackbarContext = createContext<SnackbarValue>(snackbarDefaultValue);
