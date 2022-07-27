// <reference types="vitest" />
// https://vitejs.dev/config/
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
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
