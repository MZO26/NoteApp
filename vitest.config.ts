import { defineConfig } from "vitest/config";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/tests/**/*.test.ts"],
  },
});
