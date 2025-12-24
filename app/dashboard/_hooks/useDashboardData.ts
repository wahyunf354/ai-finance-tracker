"use client";

import { useEffect, useState, useMemo } from "react";
import { Transaction } from "@/types";
import { eachDayOfInterval, format, isSameDay, subMonths } from "date-fns";

export function useDashboardData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (res.ok) {
          setTransactions(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

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
    const today = new Date();
    const startDate = subMonths(today, 1);
    const interval = eachDayOfInterval({ start: startDate, end: today });

    return interval.map((date) => {
      const dayTransactions = transactions.filter((t) =>
        isSameDay(new Date(t.date), date)
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
  }, [transactions]);

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
