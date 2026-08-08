import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPlainObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  return JSON.parse(JSON.stringify(obj));
}

export function formatCurrency(
  amount: number | undefined | null,
  currencySymbol?: string
) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0;
  }

  const isArabic = typeof document !== "undefined" && document.documentElement.getAttribute("lang") === "ar";

  let symbol = currencySymbol;
  if (!symbol || symbol === "DA" || symbol === "DZD") {
    symbol = isArabic ? "د.ج" : "DA";
  }

  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${formatted} ${symbol}`;
}

export function generateSKU(prefix = "SKU") {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export function generateBarcode() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 13);
}

export function generateInvoiceNumber(prefix = "INV") {
  const date = new Date();
  const ymd =
    date.getFullYear().toString().slice(-2) +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const seq = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${ymd}-${seq}`;
}
