import { createTheme } from "design-system-tracktor";
import colors from "@/constants/colors";

const darkTheme = createTheme({
  palette: {
    background: {
      default: colors.backgroundPrimary,
    },
    mode: "dark",
    primary: {
      main: colors.primaryMain,
    },
    secondary: {
      main: colors.secondaryMain,
    },
  },
});

export default darkTheme;
