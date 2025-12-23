export type TransactionType = "pengeluaran" | "pemasukan";

export interface Transaction {
  id: string; // generated client-side or by DB
  tanggal: string; // YYYY-MM-DD
  jenis: TransactionType;
  kategori: string;
  nominal: number;
  catatan: string;
}

export interface ProcessingResponse {
  success: boolean;
  data?: Transaction[];
  error?: string;
  transcript?: string;
}
