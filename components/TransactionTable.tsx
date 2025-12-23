"use client";

import React from "react";
import { Transaction } from "@/types";
import { Download, FileText } from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  const handleExport = async () => {
    try {
      const response = await fetch("/api/export-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan-Keuangan-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error(error);
      alert("Gagal export file.");
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
          <FileText size={32} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-200">Belum ada data</h3>
          <p className="text-slate-400">
            Rekam suara untuk menambah transaksi baru.
          </p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.jenis === "pemasukan")
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalExpense = transactions
    .filter((t) => t.jenis === "pengeluaran")
    .reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl border-l-4 border-green-500">
          <p className="text-slate-400 text-sm mb-1">Total Pemasukan</p>
          <p className="text-xl font-bold text-white">
            {formatRupiah(totalIncome)}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl border-l-4 border-red-500">
          <p className="text-slate-400 text-sm mb-1">Total Pengeluaran</p>
          <p className="text-xl font-bold text-white">
            {formatRupiah(totalExpense)}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-white">Riwayat Transaksi</h3>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
          >
            <Download size={16} /> Export Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Catatan</th>
                <th className="px-4 py-3 font-medium text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-300 font-mono">
                    {format(new Date(t.tanggal), "dd MMM yyyy", {
                      locale: localeId,
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {t.kategori}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-slate-300 max-w-[200px] truncate"
                    title={t.catatan}
                  >
                    {t.catatan}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-medium",
                      t.jenis === "pemasukan"
                        ? "text-green-400"
                        : "text-red-400"
                    )}
                  >
                    {t.jenis === "pemasukan" ? "+" : "-"}
                    {formatRupiah(t.nominal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
