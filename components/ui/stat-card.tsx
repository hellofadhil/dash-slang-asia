import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

/**
 * Warna yang didukung untuk StatCard
 */
type StatCardColor = "blue" | "indigo" | "teal" | "rose" | "amber" | "emerald" | "purple"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: StatCardColor
  className?: string
}

/**
 * Pemetaan warna untuk StatCard
 * Menggunakan kelas Tailwind untuk konsistensi
 */
const COLOR_STYLES: Record<
  StatCardColor,
  {
    bgGradient: string
    iconBg: string
    iconColor: string
  }
> = {
  blue: {
    bgGradient: "from-blue-500/5 to-blue-500/10",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  indigo: {
    bgGradient: "from-indigo-500/5 to-indigo-500/10",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
  },
  teal: {
    bgGradient: "from-teal-500/5 to-teal-500/10",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500",
  },
  rose: {
    bgGradient: "from-rose-500/5 to-rose-500/10",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
  amber: {
    bgGradient: "from-amber-500/5 to-amber-500/10",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  emerald: {
    bgGradient: "from-emerald-500/5 to-emerald-500/10",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  purple: {
    bgGradient: "from-purple-500/5 to-purple-500/10",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
}

/**
 * Komponen StatCard
 *
 * Komponen yang dapat digunakan kembali untuk menampilkan statistik dengan ikon dan warna yang sesuai
 * Digunakan di dashboard untuk menampilkan berbagai metrik
 */
export function StatCard({ title, value, icon: Icon, color, className }: StatCardProps) {
  const styles = COLOR_STYLES[color]

  return (
    <Card className={cn("overflow-hidden border-none shadow-sm bg-gradient-to-br", styles.bgGradient, className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("rounded-full p-2", styles.iconBg)}>
            <Icon className={cn("h-6 w-6", styles.iconColor)} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

