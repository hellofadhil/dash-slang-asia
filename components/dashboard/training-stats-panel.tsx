import { Card, CardContent } from "@/components/ui/card"
import { ProgressStat } from "@/components/ui/progress-stat"
import { formatCurrency } from "@/lib/utils"

interface TrainingStatsPanelProps {
  totalRevenue: number
  totalParticipants: number
  upcomingEventsCount: number
  totalEvents: number
  activeTrainersCount: number
  totalTrainers: number
}

/**
 * Komponen TrainingStatsPanel
 *
 * Menampilkan statistik pelatihan dengan progress bar
 */
export function TrainingStatsPanel({
  totalRevenue,
  totalParticipants,
  upcomingEventsCount,
  totalEvents,
  activeTrainersCount,
  totalTrainers,
}: TrainingStatsPanelProps) {
  // Hitung persentase event mendatang dan pelatih aktif
  const upcomingEventsPercentage = totalEvents > 0 ? (upcomingEventsCount / totalEvents) * 100 : 0

  const activeTrainersPercentage = totalTrainers > 0 ? (activeTrainersCount / totalTrainers) * 100 : 0

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Statistik Pelatihan</h3>
        </div>
        <div className="space-y-6">
          {/* Statistik Pendapatan */}
          <ProgressStat
            label="Total Pendapatan"
            value={formatCurrency(totalRevenue)}
            percentage={70}
            color="bg-primary"
          />

          {/* Statistik Peserta */}
          <ProgressStat
            label="Total Peserta"
            value={totalParticipants.toString()}
            percentage={60}
            color="bg-blue-500"
          />

          {/* Statistik Event Mendatang */}
          <ProgressStat
            label="Event Mendatang"
            value={upcomingEventsCount.toString()}
            percentage={upcomingEventsPercentage}
            color="bg-green-500"
          />

          {/* Statistik Pelatih Aktif */}
          <ProgressStat
            label="Pelatih Aktif"
            value={activeTrainersCount.toString()}
            percentage={activeTrainersPercentage}
            color="bg-purple-500"
          />
        </div>
      </CardContent>
    </Card>
  )
}

