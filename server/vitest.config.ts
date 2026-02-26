import { defineConfig } from "vitest/config";
import { readFileSync } from "fs";

const envTest: Record<string, string> = Object.fromEntries(
  readFileSync(".env.test", "utf-8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=", 2) as [string, string]),
);
for (const [key, value] of Object.entries(envTest)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

export default defineConfig({
  test: {
    api: {
      port: 51205,
    },
  },
});
