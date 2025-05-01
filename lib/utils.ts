import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Menggabungkan kelas CSS dengan dukungan untuk Tailwind CSS
 * @param inputs - Array dari kelas CSS yang akan digabungkan
 * @returns string - String kelas CSS yang sudah digabungkan
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Memformat angka menjadi format mata uang
 * @param amount - Jumlah yang akan diformat
 * @returns string - String dalam format mata uang
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Menghasilkan ID acak
 * @returns string - ID acak
 */
export function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Memformat tanggal ke format lokal Indonesia
 * @param date - Tanggal yang akan diformat (timestamp atau Date)
 * @returns string - Tanggal yang sudah diformat
 */
export function formatDate(date: number | Date) {
  const dateObj = typeof date === "number" ? new Date(date) : date

  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/**
 * Memotong teks jika melebihi panjang maksimum
 * @param text - Teks yang akan dipotong
 * @param maxLength - Panjang maksimum teks
 * @returns string - Teks yang sudah dipotong
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

