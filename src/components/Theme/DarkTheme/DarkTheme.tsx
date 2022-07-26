import CssBaseline from "design-system/lib/components/CssBaseline";
import ThemeProvider from "design-system/lib/context/Theme/ThemeProvider";
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
