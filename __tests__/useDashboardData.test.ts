import { renderHook, waitFor } from "@testing-library/react";
import { useDashboardData } from "@/app/dashboard/_hooks/useDashboardData";

// Mock global fetch
global.fetch = jest.fn();

const mockTransactions = [
  {
    id: "1",
    amount: 100000,
    type: "income",
    category: "Salary",
    date: new Date().toISOString(),
    description: "Salary",
  },
  {
    id: "2",
    amount: 50000,
    type: "expense",
    category: "Food",
    date: new Date().toISOString(),
    description: "Lunch",
  },
  {
    id: "3",
    amount: 20000,
    type: "expense",
    category: "Transport",
    date: new Date().toISOString(),
    description: "Taxi",
  },
];

describe("useDashboardData", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("fetches transactions and calculates stats correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockTransactions }),
    });

    const { result } = renderHook(() => useDashboardData());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.transactions).toEqual([]);

    // Wait for loading to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactions).toEqual(mockTransactions);

    // Check stats
    // Income: 100000
    // Expense: 50000 + 20000 = 70000
    // Balance: 30000
    // Savings Rate: (100000 - 70000) / 100000 * 100 = 30%
    expect(result.current.stats).toEqual({
      totalIncome: 100000,
      totalExpense: 70000,
      balance: 30000,
      savingsRate: 30,
    });
  });

  it("calculates category distributions correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockTransactions }),
    });

    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Desired: Food 50000, Transport 20000. Sorted by value desc.
    const expectedCategories = [
      { name: "Food", value: 50000 },
      { name: "Transport", value: 20000 },
    ];

    expect(result.current.categoryData).toEqual(expectedCategories);
  });

  it("handles fetch error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactions).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching dashboard data:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
