import * as path from "path";

const config = () => ({
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

export default config;
