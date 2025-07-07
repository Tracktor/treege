import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { dependencies, name, peerDependencies } from "./package.json";

// https://vitejs.dev/config/
const config = ({ mode }) =>
  defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, "src/main.ts"),
        fileName: "[name]",
        formats: ["umd", "es"],
        name,
      },
      rollupOptions: {
        external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
        output: {
          globals: {
            "@codemirror/lang-json": "codemirrorLangJson",
            "@mui/icons-material": "iconsMaterial",
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
    plugins: [
      dts({
        exclude: [
          "src/App.tsx",
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/stories/**/*",
          "**/*.stories.tsx",
          "**/*.stories.ts",
          "vite.config.ts",
        ],
        insertTypesEntry: true,
      }),
      react(),
    ],
    publicDir: mode === "production" ? false : undefined,
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        { find: "~", replacement: resolve(__dirname) },
      ],
    },
    // @ts-expect-error Vitest option
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "src/config/test.config.ts",
    },
  });

export default config;
