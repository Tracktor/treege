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
      name,
    },
    rollupOptions: {
      external: [...Object.keys(dependencies)],
      output: {
        globals: {
          "@codemirror/lang-json": "langJson",
          "@uiw/codemirror-theme-dracula": "codemirrorThemeDracula",
          "@uiw/react-codemirror": "CodeMirror",
          "design-system-tracktor": "designSystemTracktor",
          react: "React",
          "react-d3-tree": "Tree",
          "react-i18next": "reactI18next",
        },
      },
    },
  },
  plugins: [dts(), react({ jsxRuntime: "classic" })],
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
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
