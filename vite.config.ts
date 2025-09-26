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
            react: "React",
            "react-dom": "ReactDOM",
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
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        { find: "~", replacement: resolve(__dirname) },
      ],
    },
  });

export default config;
