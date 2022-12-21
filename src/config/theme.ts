import type { ThemeOptions } from "design-system-tracktor";
import colors from "@/constants/colors";

const darkTheme: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === "primary" && ownerState.variant === "contained" && { color: `${colors.tertiary} !important` }),
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
