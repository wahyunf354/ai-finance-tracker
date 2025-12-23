import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number | string) {
  if (value === null || value === undefined) return "Rp 0";

  let number: number;
  if (typeof value === "number") {
    number = value;
  } else {
    number = Number(String(value).replace(/[^0-9]/g, ""));
  }

  if (isNaN(number)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}
