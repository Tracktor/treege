import { GlobalStyles, ThemeProvider } from "design-system-tracktor";
import type { ReactNode } from "react";
import darkTheme from "@/constants/theme";

interface DarkThemeProps {
  children?: ReactNode;
}

const DarkTheme = ({ children }: DarkThemeProps) => (
  <>
    <GlobalStyles
      styles={{
        "*": {
          scrollbarColor: "rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)",
          scrollbarWidth: "thin",
        },
        "*::-webkit-scrollbar": {
          height: 6,
          width: 6,
        },
        "*::-webkit-scrollbar-button": {
          height: 0,
          width: 0,
        },
        "*::-webkit-scrollbar-corner": {
          background: "transparent",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          border: 0,
          borderRadius: 10,
        },
        "*::-webkit-scrollbar-track": {
          background: "rgba(255, 255, 255, 0.05)",
        },
        "html, body, #root": {
          height: "100%",
        },
      }}
    />
    <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
  </>
);

export default DarkTheme;
