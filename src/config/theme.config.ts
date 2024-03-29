import type { ThemeOptions } from "@tracktor/design-system";
import colors from "@/constants/colors";

const darkTheme: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === "primary" && ownerState.variant === "contained" && { color: `${colors.tertiary} !important` }),
          ...(ownerState.disabled && ownerState.variant === "contained" && { color: `white` }),
        }),
      },
    },
  },
  palette: {
    background: {
      default: colors.background,
      paper: colors.background,
    },
    mode: "dark",
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
  },
};

export default darkTheme;
