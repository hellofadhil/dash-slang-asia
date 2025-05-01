import { GraduationCap } from "lucide-react"

/**
 * Ukuran yang didukung untuk Logo
 */
type LogoSize = "sm" | "md" | "lg"

interface LogoProps {
  size?: LogoSize
  showText?: boolean
}

/**
 * Pemetaan ukuran untuk ikon logo
 */
const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
}

/**
 * Komponen Logo
 *
 * Menampilkan logo aplikasi dengan ukuran yang dapat disesuaikan
 */
export function Logo({ size = "md", showText = true }: LogoProps) {
  // Tentukan ukuran teks berdasarkan ukuran logo
  const textSizeClass = size === "lg" ? "text-xl" : size === "md" ? "text-lg" : "text-base"

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Efek blur di belakang logo */}
        <div className="absolute inset-0 bg-primary rounded-full blur-sm opacity-20"></div>

        {/* Logo utama */}
        <div className="relative bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-1.5 rounded-full">
          <GraduationCap className={SIZE_CLASSES[size]} strokeWidth={2} />
        </div>
      </div>

      {/* Teks logo */}
      {showText && <span className={`font-bold ${textSizeClass}`}>TrainHub</span>}
    </div>
  )
}

