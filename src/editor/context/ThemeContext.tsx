import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  setTheme: () => null,
  theme: "system",
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export const ThemeProvider = ({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      setTheme: (newTheme: Theme) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, newTheme);
        }
        setTheme(newTheme);
      },
      theme,
    }),
    [storageKey, theme],
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
