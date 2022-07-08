import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import darkTheme from "@/constants/theme";

interface DarkThemeProps {
  children?: ReactNode;
}

const DarkTheme = ({ children }: DarkThemeProps) => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default DarkTheme;
