"use client";

import { useEffect, useState } from "react";

import {
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import * as ExcelJS from "exceljs";
import { cn, formatRupiah } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Transaction = {
  id: string;
  created_at: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();

      console.log("data", data);

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

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
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCCCCC" },
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
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-2xl mx-auto space-y-6 pt-4 px-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <Button
          onClick={exportToExcel}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Income</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/5 to-rose-500/5 border-red-500/20 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">Expenses</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${totalExpense.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and List */}
      <Card className="flex-1 flex flex-col min-h-0 border bg-card shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50 border-input"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <>
              {/* Mobile View (Cards) */}
              <div className="block md:hidden">
                <div className="divide-y divide-border">
                  {filtered.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 flex flex-col gap-2 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-foreground line-clamp-2 pr-2">
                          {t.description}
                        </span>
                        <span
                          className={cn(
                            "font-bold whitespace-nowrap",
                            t.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {t.type === "income" ? "+" : "-"}
                          {formatRupiah(t.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {t.date}
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground border border-border">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop View (Table) */}
              <div className="hidden md:block">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 backdrop-blur-md z-10">
                    <tr>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 opacity-50" />
                            {t.date}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {t.description}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                            {t.category}
                          </span>
                        </td>
                        <td
                          className={cn(
                            "px-4 py-3 text-right font-bold",
                            t.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {t.type === "income" ? "+" : "-"}$
                          {formatRupiah(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
