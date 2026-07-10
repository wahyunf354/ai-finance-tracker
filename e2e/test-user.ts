/**
 * Shared identity for the mocked E2E session.
 *
 * Kept in a plain module (not a `*.spec`/`*.setup` file) so both the auth setup
 * and the specs can import it — Playwright forbids importing one test file from
 * another. Nothing in the app restricts which email may log in, so any stable
 * address works.
 */
export const TEST_USER = {
  email: "e2e-tester@example.com",
  name: "E2E Tester",
  sub: "e2e-tester",
} as const;
