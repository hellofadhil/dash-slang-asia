/**
 * Komponen ProgressStat
 *
 * Menampilkan statistik dengan progress bar
 */
interface ProgressStatProps {
  label: string
  value: string
  percentage: number
  color: string
}

export function ProgressStat({ label, value, percentage, color }: ProgressStatProps) {
  // Pastikan persentase berada dalam rentang 0-100
  const safePercentage = Math.min(100, Math.max(0, percentage))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${safePercentage}%` }}></div>
      </div>
    </div>
  )
}

