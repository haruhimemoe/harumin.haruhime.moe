/**
 * @file vitest.config.ts
 * @desc Vitest: unit tests for the dashboard rules, the bot client, settings storage (in-memory
 *       MongoDB), env and the command list; server-only stubbed for plain Node.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import path from "node:path";
import { defineConfig } from "vitest/config";

const root = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
      "server-only": path.resolve(root, "node_modules/server-only/empty.js"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    hookTimeout: 60_000,
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/env.ts"],
      exclude: ["src/lib/auth.ts", "src/lib/db.ts"],
    },
  },
});
