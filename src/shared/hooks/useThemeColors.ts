/**
 * useThemeColors hook for Web
 *
 * On web, theming is handled via CSS classes and CSS variables in the global stylesheet.
 * This hook provides color values that map to CSS variables or returns empty strings
 * since actual colors are defined in the CSS theme.
 *
 * React Native uses this same interface but returns actual color values.
 */

export type ThemeColors = {
  // Backgrounds
  background: string;
  card: string;
  input: string;

  // Borders
  border: string;
  borderFocus: string;

  // States
  error: string;
  errorBg: string;
  errorLight: string;
  muted: string;
  primary: string;
  primaryDisabled: string;
  primaryLight: string;
  success: string;
  successBg: string;

  // Text
  text: string;
  textMuted: string;
  textSecondary: string;

  // UI
  separator: string;
};

/**
 * For web, we don't need to return actual color values since theming
 * is handled via CSS classes (`.light` / `.dark`) and CSS variables.
 *
 * Components should use CSS classes for styling on web instead of inline styles.
 * This hook exists for API compatibility with React Native.
 */
export const useThemeColors = (): ThemeColors => {
  // Return empty strings or CSS variable references
  // Web components should use CSS classes instead of these values
  return {
    // Backgrounds
    background: "var(--background)",

    // Borders
    border: "var(--border)",
    borderFocus: "var(--ring)",
    card: "var(--card)",

    // States
    error: "var(--destructive)",
    errorBg: "var(--destructive)",
    errorLight: "var(--destructive-foreground)",
    input: "var(--input)",
    muted: "var(--muted)",
    primary: "var(--primary)",
    primaryDisabled: "var(--muted)",
    primaryLight: "var(--primary-foreground)",

    // UI
    separator: "var(--border)",
    success: "var(--success)",
    successBg: "var(--success)",

    // Text
    text: "var(--foreground)",
    textMuted: "var(--muted-foreground)",
    textSecondary: "var(--foreground)",
  };
};
