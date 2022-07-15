import { createTheme } from "@mui/material/styles";
import colors from "@/styles/colors.module.scss";

const darkTheme = createTheme({
  palette: {
    background: {
      default: colors.backgroundPrimary,
    },
    mode: "dark",
    primary: {
      dark: colors.primaryDark,
      light: colors.primaryLight,
      main: colors.primaryMain,
    },
  },
});

export default darkTheme;
