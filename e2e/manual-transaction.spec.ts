import { test, expect, type Route } from "@playwright/test";
import { TEST_USER } from "./test-user";

/**
 * E2E: manual transaction input (feature/manual-transaction-input).
 *
 * Drives the real UI — floating "add" button, modal form, submit — but stubs
 * the network so the test is deterministic and never writes to the real
 * Supabase database. The stubs stand in for the `/api/transactions` and
 * `/api/user` routes; the POST handler captures the request body so we can
 * assert the frontend sent exactly what the form was filled with.
 */

type CreatedBody = {
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
};

test.describe("Manual transaction input", () => {
  let createdBody: CreatedBody | null;

  test.beforeEach(async ({ page }) => {
    createdBody = null;

    // Non-premium user so export stays gated and nothing extra is required.
    await page.route("**/api/user", (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          email: TEST_USER.email,
          name: TEST_USER.name,
          is_premium: false,
          billing_cycle_start_day: 1,
        }),
      })
    );

    await page.route("**/api/transactions**", async (route: Route) => {
      const request = route.request();

      if (request.method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [],
            meta: { total: 0, page: 1, limit: 20 },
          }),
        });
      }

      if (request.method() === "POST") {
        createdBody = request.postDataJSON() as CreatedBody;
        // Echo back a persisted-looking row, as the real route would (201).
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "e2e-generated-id",
            ...createdBody,
            source: "manual",
            user_email: TEST_USER.email,
          }),
        });
      }

      return route.continue();
    });
  });

  test("adds a transaction via the modal and shows it in the list", async ({
    page,
  }) => {
    await page.goto("/transactions");

    // Empty state first (GET stub returns no rows).
    await expect(page.getByText("No transactions found")).toBeVisible();

    // Open the modal via the floating action button.
    await page.getByRole("button", { name: "Add Transaction" }).click();

    const form = page.locator("form").filter({
      has: page.getByRole("button", { name: "Save" }),
    });
    await expect(form).toBeVisible();

    // Fill the form. Date is pre-filled with today; leave it as-is.
    await form.locator("input").first().fill("E2E Coffee");
    await form.locator('input[type="number"]').fill("42000");
    await form.locator("select").first().selectOption("Food");
    await form.locator("select").nth(1).selectOption("expense");

    await form.getByRole("button", { name: "Save" }).click();

    // Success toast (sonner).
    await expect(page.getByText("Transaction added successfully")).toBeVisible();

    // The new row is prepended to the list. The list renders in two layouts
    // (mobile + desktop) and CSS hides one, so assert the visible instance.
    await expect(
      page.getByText("E2E Coffee").and(page.locator(":visible")).first()
    ).toBeVisible();

    // The frontend sent exactly what we filled in.
    expect(createdBody).not.toBeNull();
    expect(createdBody).toMatchObject({
      description: "E2E Coffee",
      amount: 42000,
      category: "Food",
      type: "expense",
    });
    expect(createdBody?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("validation blocks submit when required fields are empty", async ({
    page,
  }) => {
    await page.goto("/transactions");

    await page.getByRole("button", { name: "Add Transaction" }).click();

    const form = page.locator("form").filter({
      has: page.getByRole("button", { name: "Save" }),
    });
    await expect(form).toBeVisible();

    // Submit immediately: description & amount are empty and `required`, so the
    // browser blocks submission and no POST is made.
    await form.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Transaction added successfully")).toHaveCount(0);
    expect(createdBody).toBeNull();
    // Modal is still open.
    await expect(form).toBeVisible();
  });
});
