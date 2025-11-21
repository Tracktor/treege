/**
 * Color palette for light and dark themes
 */
export const themeColors = {
  dark: {
    // Backgrounds
    background: "#0A0A0A",

    // Borders
    border: "#3A3A3C",
    borderFocus: "#0A84FF",
    card: "#1C1C1E",

    // States
    error: "#FF453A",
    errorBg: "#3A1818",
    errorLight: "#3A1818",
    input: "#2C2C2E",

    // Primary
    muted: "#4A4A4C",
    primary: "#0A84FF",
    primaryDisabled: "#4A4A4C",
    primaryLight: "#1C3A5A",

    // UI
    separator: "#38383A",
    success: "#30D158",
    successBg: "#1A3A24",

    // Text
    text: "#FFFFFF",
    textMuted: "#6B7280",
    textSecondary: "#A1A1A6",
  },
  light: {
    // Backgrounds
    background: "#FFFFFF",

    // Borders
    border: "#D1D5DB",
    borderFocus: "#3B82F6",
    card: "#F9FAFB",

    // States
    error: "#EF4444",
    errorBg: "#FEE2E2",
    errorLight: "#FEE2E2",
    input: "#FFFFFF",

    // Primary
    muted: "#9CA3AF",
    primary: "#3B82F6",
    primaryDisabled: "#9CA3AF",
    primaryLight: "#EFF6FF",

    // UI
    separator: "#E5E7EB",
    success: "#10B981",
    successBg: "#D1FAE5",

    // Text
    text: "#111827",
    textMuted: "#6B7280",
    textSecondary: "#374151",
  },
};

export type ThemeColors = typeof themeColors.light;
