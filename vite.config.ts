import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";
import { dependencies, name } from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      fileName: "[name]",
      formats: ["umd", "es"],
      name,
    },
    rollupOptions: {
      external: [...Object.keys(dependencies)],
      output: {
        globals: {
          "@codemirror/lang-json": "codemirrorLangJson",
          "@tanstack/react-query": "reactQuery",
          "@tracktor/design-system": "tracktorDesignSystem",
          "@uiw/codemirror-theme-dracula": "codemirrorThemeDracula",
          "@uiw/react-codemirror": "reactCodemirror",
          axios: "axios",
          i18next: "i18next",
          "i18next-browser-languagedetector": "i18nextBrowserLanguageDetector",
          react: "React",
          "react-d3-tree": "ReactD3Tree",
          "react-dom": "ReactDOM",
          "react-i18next": "reactI18next",
        },
      },
    },
  },
  plugins: [dts({ insertTypesEntry: true }), react()],
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "src") },
      { find: "~", replacement: resolve(__dirname) },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "src/config/test.config.ts",
  },
});
