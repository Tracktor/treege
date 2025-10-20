import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  theme?: "dark" | "light";
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

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  theme: controlledTheme,
  ...props
}: ThemeProviderProps) => {
  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    // If controlled, use controlled theme and ignore localStorage
    if (controlledTheme) return controlledTheme;
    // Otherwise, use localStorage or default
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  // Use controlled theme if provided, otherwise use internal state
  const theme = controlledTheme ?? internalTheme;

  const value = useMemo(
    () => ({
      setTheme: (newTheme: Theme) => {
        // Don't update localStorage if controlled
        if (!controlledTheme && typeof window !== "undefined") {
          localStorage.setItem(storageKey, newTheme);
        }
        setInternalTheme(newTheme);
      },
      theme,
    }),
    [storageKey, theme, controlledTheme],
  );

  /**
   * Sync controlled theme changes
   */
  useEffect(() => {
    if (controlledTheme) {
      setInternalTheme(controlledTheme);
    }
  }, [controlledTheme]);

  /**
   * Apply theme to document root
   */
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
