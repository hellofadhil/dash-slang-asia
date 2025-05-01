import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * Tipe untuk status yang didukung oleh StatusBadge
 */
type StatusType =
  | "active"
  | "inactive"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "corporate"
  | "academic"
  | "nonprofit"
  | "government"

/**
 * Pemetaan warna untuk setiap jenis status
 * Menggunakan kelas Tailwind untuk konsistensi
 */
const STATUS_COLORS: Record<StatusType, string> = {
  // Status umum
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",

  // Status event
  upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  ongoing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  completed: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",

  // Tipe partner
  corporate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  academic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  nonprofit: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  government: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

/**
 * Komponen StatusBadge
 *
 * Komponen yang dapat digunakan kembali untuk menampilkan status dengan warna yang sesuai
 * Digunakan di berbagai halaman untuk menampilkan status event, trainer, partner, dll.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Kapitalisasi huruf pertama status untuk tampilan yang lebih baik
  const displayText = status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <Badge variant="outline" className={cn(STATUS_COLORS[status as StatusType], className)}>
      {displayText}
    </Badge>
  )
}

