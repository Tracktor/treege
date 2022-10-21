import { Alert, Snackbar } from "design-system-tracktor";
import { ReactNode, useMemo, useReducer } from "react";
import { SnackbarContext, snackbarDefaultValue } from "@/context/Snackbar/SnackbarContext";
import snackbarReducer, { closeSnackbar } from "@/context/Snackbar/snackbarReducer";

interface SnackbarProviderProps {
  children: ReactNode;
}

const styles = {
  snackbarAlert: { width: "100%" },
};

const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbar, dispatchSnackbar] = useReducer(snackbarReducer, snackbarDefaultValue.snackbar);
  const { message, open, severity } = snackbar;
  const AUTO_HIDE_DURATION = 6000;

  const close = () => dispatchSnackbar(closeSnackbar());

  const value = useMemo(
    () => ({
      dispatchSnackbar,
      snackbar,
    }),
    [snackbar, dispatchSnackbar]
  );

  return (
    <SnackbarContext.Provider value={value}>
      <Snackbar open={open} autoHideDuration={AUTO_HIDE_DURATION} onClose={close}>
        <Alert onClose={close} severity={severity} sx={styles.snackbarAlert}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
