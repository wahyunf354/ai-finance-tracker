"use client";

import React, { useState } from "react";
import { Transaction, TransactionType } from "@/types";
import { Trash2, Calendar, Tag, DollarSign, FileText } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionReviewProps {
  initialData: Transaction[];
  onSave: (transactions: Transaction[]) => void;
  onCancel: () => void;
}

export default function TransactionReview({
  initialData,
  onSave,
  onCancel,
}: TransactionReviewProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const updateTransaction = (
    id: string,
    field: keyof Transaction,
    value: string | number
  ) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 glass-panel rounded-xl p-6">
        <p className="text-slate-400">Tidak ada transaksi yang terdeteksi.</p>
        <button
          onClick={onCancel}
          className="mt-4 text-violet-400 hover:text-violet-300"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Review Hasil AI</h2>
        <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
          {transactions.length} Transaksi Ditemukan
        </span>
      </div>

      <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
        <AnimatePresence>
          {transactions.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-4 rounded-xl space-y-3 relative group"
            >
              <button
                onClick={() => removeTransaction(t.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> Tanggal
                  </label>
                  <input
                    type="date"
                    value={t.tanggal}
                    onChange={(e) =>
                      updateTransaction(t.id, "tanggal", e.target.value)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-2 py-1 text-sm focus:border-violet-500 outline-none"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 flex items-center gap-1">
                    <DollarSign size={12} /> Nominal
                  </label>
                  <input
                    type="number"
                    value={t.nominal}
                    onChange={(e) =>
                      updateTransaction(
                        t.id,
                        "nominal",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-green-400 focus:border-violet-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 text-right">
                    {formatRupiah(t.nominal)}
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 flex items-center gap-1">
                    <Tag size={12} /> Kategori
                  </label>
                  <input
                    type="text"
                    value={t.kategori}
                    onChange={(e) =>
                      updateTransaction(t.id, "kategori", e.target.value)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-2 py-1 text-sm focus:border-violet-500 outline-none"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 flex items-center gap-1">
                    <Tag size={12} /> Jenis
                  </label>
                  <select
                    value={t.jenis}
                    onChange={(e) =>
                      updateTransaction(
                        t.id,
                        "jenis",
                        e.target.value as TransactionType
                      )
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-2 py-1 text-sm focus:border-violet-500 outline-none"
                  >
                    <option value="pengeluaran">Pengeluaran</option>
                    <option value="pemasukan">Pemasukan</option>
                  </select>
                </div>

                {/* Note */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-slate-400 flex items-center gap-1">
                    <FileText size={12} /> Catatan
                  </label>
                  <input
                    type="text"
                    value={t.catatan}
                    onChange={(e) =>
                      updateTransaction(t.id, "catatan", e.target.value)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-2 py-1 text-sm focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={() => onSave(transactions)}
          className="flex-1 glass-button py-3 rounded-xl text-white font-semibold shadow-lg shadow-violet-500/20"
        >
          Simpan Semua
        </button>
      </div>
    </div>
  );
}
