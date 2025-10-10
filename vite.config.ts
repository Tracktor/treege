import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { dependencies, name, peerDependencies } from "./package.json";

// https://vitejs.dev/config/
const config = () =>
  defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, "src/main.ts"),
        fileName: "[name]",
        formats: ["umd", "es"],
        name,
      },
      rollupOptions: {
        external: [...Object.keys(dependencies ?? {}).filter((dep) => dep !== "nanoid"), ...Object.keys(peerDependencies ?? {})],
        output: {
          globals: {
            "@xyflow/react": "ReactFlow",
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
      tailwindcss(),
    ],
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "./src") },
        { find: "~", replacement: resolve(__dirname) },
      ],
    },
  });

export default config;
