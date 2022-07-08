import * as path from "path";

export default () => ({
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
