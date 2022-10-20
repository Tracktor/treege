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
      external: [...Object.keys(dependencies).filter((dependency) => dependency !== "react-d3-tree")],
      output: {
        globals: {
          "@codemirror/lang-json": "langJson",
          "@uiw/codemirror-theme-dracula": "codemirrorThemeDracula",
          "@uiw/react-codemirror": "CodeMirror",
          "design-system-tracktor": "designSystemTracktor",
          i18next: "i18n",
          "i18next-browser-languagedetector": "LanguageDetector",
          react: "React",
          "react-d3-tree": "Tree",
          "react-dom": "ReactDOM",
          "react-i18next": "reactI18next",
        },
      },
    },
  },
  plugins: [dts(), react()],
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "src") },
      { find: "~", replacement: resolve(__dirname) },
    ],
  },
  test: {
    coverage: {
      exclude: ["node_modules/", "src/config/setupTests.ts"],
      reporter: ["text", "html"],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: "src/config/setupTests.ts",
  },
});
