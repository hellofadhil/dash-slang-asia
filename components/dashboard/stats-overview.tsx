import { StatCard } from "@/components/ui/stat-card"
import { Calendar, GraduationCap, Handshake, Tags } from "lucide-react"

interface StatsOverviewProps {
  totalEvents: number
  totalTrainers: number
  totalPartners: number
  totalEventCategories: number
}

/**
 * Komponen StatsOverview
 *
 * Menampilkan ikhtisar statistik utama dalam bentuk kartu
 */
export function StatsOverview({ totalEvents, totalTrainers, totalPartners, totalEventCategories }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Event" value={totalEvents} icon={Calendar} color="blue" />

      <StatCard title="Pelatih" value={totalTrainers} icon={GraduationCap} color="indigo" />

      <StatCard title="Mitra" value={totalPartners} icon={Handshake} color="teal" />

      <StatCard title="Kategori Event" value={totalEventCategories} icon={Tags} color="rose" />
    </div>
  )
}

