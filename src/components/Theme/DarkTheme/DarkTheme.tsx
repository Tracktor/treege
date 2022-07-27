import { ThemeProvider } from "design-system";
import type { ReactNode } from "react";
import darkTheme from "@/constants/theme";

interface DarkThemeProps {
  children?: ReactNode;
}

const DarkTheme = ({ children }: DarkThemeProps) => <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;

export default DarkTheme;
