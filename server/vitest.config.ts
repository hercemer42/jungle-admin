import { defineConfig } from "vitest/config";
import { readFileSync } from "fs";

const envTest = Object.fromEntries(
  readFileSync(".env.test", "utf-8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=", 2)),
);
Object.assign(process.env, envTest);

export default defineConfig({
  test: {
    api: {
      port: 51205,
    },
  },
});
