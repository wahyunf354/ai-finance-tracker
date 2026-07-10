import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

/**
 * Load env exactly the way Next.js does (`.env.local`, `.env`, …) so the
 * `AUTH_SECRET` the setup project uses to mint the session cookie is parsed
 * identically to how the running server reads it — including quoting, inline
 * comments, and duplicate-key precedence. Rolling our own parser here silently
 * diverged from Next's and produced a mismatched secret.
 */
loadEnvConfig(process.cwd());

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    // Mints a NextAuth session cookie once, saved to e2e/.auth/user.json.
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    // The build uses `--webpack` because next-pwa injects a webpack config that
    // clashes with Next 16's default Turbopack. Match that here.
    command: "npm run dev -- --webpack",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
