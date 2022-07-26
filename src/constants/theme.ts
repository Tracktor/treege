import createTheme from "design-system/lib/styles/createTheme";
import colors from "@/styles/colors.module.scss";

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
