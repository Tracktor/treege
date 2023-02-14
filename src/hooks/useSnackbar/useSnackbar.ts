import { useContext } from "react";
import { SnackbarContext, SnackbarState } from "@/context/Snackbar/SnackbarContext";
import { closeSnackbar, openSnackbar } from "@/context/Snackbar/snackbarReducer";

const useSnackbar = () => {
  const { dispatchSnackbar } = useContext(SnackbarContext);

  const close = () => dispatchSnackbar(closeSnackbar());

  const open = (message: SnackbarState["message"], severity: SnackbarState["severity"] = "success") =>
    dispatchSnackbar(openSnackbar(message, severity));

  return { close, open };
};

export default useSnackbar;
