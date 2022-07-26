import { createTheme } from "@mui/material/styles";
import colors from "@/styles/colors.module.scss";

console.log('test');

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
