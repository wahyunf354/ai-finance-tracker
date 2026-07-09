import { useEffect, useState, useMemo, useCallback } from "react";
import { Transaction } from "@/types";
import { eachDayOfInterval, format, isSameDay } from "date-fns";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export function useDashboardData(dateRange?: DateRange) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Use strict values for dependencies to avoid infinite loops from object identity
  const fromStr = dateRange?.from?.toISOString();
  const toStr = dateRange?.to?.toISOString();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Increase limit to fetch all relevant transactions for stats
      params.append("limit", "10000");

      if (fromStr) {
        params.append("from", fromStr);
      }
      if (toStr) {
        params.append("to", toStr);
      }

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [fromStr, toStr]);

  useEffect(() => {
    // Only fetch if FULL date range is defined
    if (fromStr && toStr) {
      fetchTransactions();
    }
    // We removed the fallback for !dateRange because the parent component (DashboardPage)
    // ALWAYS guarantees a valid appliedDateRange state.
  }, [fetchTransactions, fromStr, toStr]);

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate: Math.max(0, savingsRate),
    };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const categories: Record<string, number> = {};

    expenses.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const chartData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    // Ensure we don't try to generate a massive interval if dates are invalid or too far apart?
    // For now assuming reasonable ranges.

    // Fallback if transaction list is empty but we want to show the empty chart structure?
    // Or just use the dateRange provided.

    let start = dateRange.from;
    let end = dateRange.to;

    // Safety check needed? date-fns throws if start > end
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }

    try {
      const interval = eachDayOfInterval({ start, end });

      return interval.map((date) => {
        const dayTransactions = transactions.filter((t) =>
          isSameDay(new Date(t.date), date),
        );
        const income = dayTransactions
          .filter((t) => t.type === "income")
          .reduce((acc, curr) => acc + curr.amount, 0);
        const expense = dayTransactions
          .filter((t) => t.type === "expense")
          .reduce((acc, curr) => acc + curr.amount, 0);

        return {
          date: format(date, "MMM dd"),
          income,
          expense,
        };
      });
    } catch (e) {
      console.error("Error generating chart interval:", e);
      return [];
    }
  }, [transactions, dateRange]);

  const topExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  return {
    transactions,
    loading,
    stats,
    categoryData,
    chartData,
    topExpenses,
  };
}
