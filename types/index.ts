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
