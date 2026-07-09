/**
 * Shared transaction category constants.
 *
 * The canonical category list previously only lived hardcoded inside the AI
 * prompt in `app/api/chat/route.ts`. This constant lets UI components (e.g. the
 * manual-input form) and future code reuse the same set.
 */
export const STANDARD_CATEGORIES = [
  "Food",
  "Transport",
  "Salary",
  "Bills",
  "Entertainment",
  "Shopping",
  "Health",
  "Savings",
  "Other",
] as const;

export type StandardCategory = (typeof STANDARD_CATEGORIES)[number];
