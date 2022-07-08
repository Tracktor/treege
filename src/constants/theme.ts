import { createTheme } from "@mui/material/styles";
import colors from "@/styles/colors.module.scss";

const darkTheme = createTheme({
  palette: {
    background: {
      default: colors.backgroundPrimary,
    },
    mode: "dark",
  },
});

export default darkTheme;
