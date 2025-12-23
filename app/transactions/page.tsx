"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import * as ExcelJS from "exceljs";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Transaction = {
  id: string;
  created_at: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Transactions");

    sheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Description", key: "description", width: 30 },
      { header: "Category", key: "category", width: 20 },
      { header: "Type", key: "type", width: 10 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    transactions.forEach((t) => {
      sheet.addRow(t);
    });

    // Stylize header
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4C1D95" }, // Purple-900
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `transactions_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const filtered = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Transactions
        </h1>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium border border-white/10"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Income</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-red-400">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">Expenses</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${totalExpense.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search and List */}
      <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No transactions found
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-black/20 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 opacity-50" />
                        {t.date}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {t.description}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10">
                        {t.category}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right font-bold",
                        t.type === "income" ? "text-green-400" : "text-red-400"
                      )}
                    >
                      {t.type === "income" ? "+" : "-"}$
                      {t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
