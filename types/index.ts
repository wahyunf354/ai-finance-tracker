export type Transaction = {
  id: string;
  created_at: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

export interface ProcessingResponse {
  success: boolean;
  data?: Transaction[];
  error?: string;
  transcript?: string;
}

export interface ChartDataItem {
  date: string;
  income: number;
  expense: number;
  [key: string]: string | number;
}

export interface CategoryDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}
