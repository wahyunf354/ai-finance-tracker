import { test as setup, expect } from "@playwright/test";
import { encode } from "next-auth/jwt";
import path from "path";
import { TEST_USER } from "./test-user";

/**
 * Authentication for E2E.
 *
 * Google OAuth can't be driven from a test, so instead of clicking through the
 * real login we mint the exact session cookie NextAuth would have set and hand
 * it to the browser via storageState. The app's middleware and `auth()` then
 * treat the browser as a logged-in user.
 *
 * The cookie is a NextAuth v5 (Auth.js) encrypted JWT. `encode` derives the
 * encryption key from AUTH_SECRET + a salt equal to the cookie name, so both
 * must match what the running server expects. In dev over http the cookie is
 * `authjs.session-token`.
 */

const SESSION_COOKIE_NAME = "authjs.session-token";
const authFile = path.join(__dirname, ".auth/user.json");

setup("authenticate", async ({ page }) => {
  const secret = process.env.AUTH_SECRET;
  expect(
    secret,
    "AUTH_SECRET must be set (loaded from .env.local by playwright.config.ts)"
  ).toBeTruthy();

  const token = await encode({
    token: {
      name: TEST_USER.name,
      email: TEST_USER.email,
      sub: TEST_USER.sub,
    },
    secret: secret!,
    salt: SESSION_COOKIE_NAME,
    maxAge: 30 * 24 * 60 * 60,
  });

  // Visit a PUBLIC page first, only to establish the origin so we can seed
  // localStorage (forcing English; the app defaults to `id`). We must not visit
  // a protected page here: middleware would redirect to /login and the server
  // response would clear our session cookie before storageState captures it.
  await page.addInitScript(() => {
    window.localStorage.setItem("language", "en");
  });
  await page.goto("/login");

  // Add the session cookie AFTER navigation so nothing on the server side can
  // mutate or drop it before we snapshot the storage state.
  await page.context().addCookies([
    {
      name: SESSION_COOKIE_NAME,
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    },
  ]);

  // Sanity check: the minted cookie must actually let us reach a protected page.
  await page.goto("/transactions");
  await expect(page).not.toHaveURL(/\/login/);

  await page.context().storageState({ path: authFile });
});
