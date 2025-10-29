import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { dependencies, name, peerDependencies } from "./package.json";

// https://vitejs.dev/config/
const config = () =>
  defineConfig({
    build: {
      cssCodeSplit: false,
      lib: {
        entry: {
          editor: resolve(__dirname, "src/editor/index.ts"),
          main: resolve(__dirname, "src/main.ts"),
          renderer: resolve(__dirname, "src/renderer/index.ts"),
        },
        fileName: "[name]",
        formats: ["es"],
        name,
      },
      rollupOptions: {
        external: [...Object.keys(dependencies ?? {}).filter((dep) => dep !== "nanoid"), ...Object.keys(peerDependencies ?? {})],
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
      tailwindcss(),
      cssInjectedByJsPlugin({
        jsAssetsFilterFunction: (outputChunk) => {
          return outputChunk.fileName.includes("TreegeEditor");
        },
      }),
    ],
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "./src") },
        { find: "~", replacement: resolve(__dirname) },
      ],
    },
  });

export default config;
