"use client"

import { useEffect, useState } from "react"
import { useEvents } from "@/components/events-provider"
import { useTrainers } from "@/components/trainers-provider"
import { usePartners } from "@/components/partners-provider"
import { useEventCategories } from "@/components/event-categories-provider"
import type { DashboardStats } from "@/lib/types"

// Impor komponen dashboard
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentEventsPanel } from "@/components/dashboard/recent-events-panel"
import { TrainingStatsPanel } from "@/components/dashboard/training-stats-panel"
import { TopTrainersPanel } from "@/components/dashboard/top-trainers-panel"
import { PartnersPanel } from "@/components/dashboard/partners-panel"

/**
 * Komponen DashboardPage
 *
 * Halaman utama dashboard yang menampilkan statistik dan data terkini
 * dari layanan pelatihan
 */
export function DashboardPage() {
  // Ambil data dari provider
  const { events, loading: eventsLoading } = useEvents()
  const { trainers, loading: trainersLoading } = useTrainers()
  const { partners, loading: partnersLoading } = usePartners()
  const { eventCategories, loading: eventCategoriesLoading } = useEventCategories()

  // State untuk menyimpan statistik dashboard
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalEvents: 0,
    totalTrainers: 0,
    totalPartners: 0,
    totalEventCategories: 0,
    recentOrders: [],
    recentEvents: [],
    topProducts: [],
    salesByDay: [],
  })

  const [loading, setLoading] = useState(true)

  // Menghitung statistik dashboard dari data yang tersedia
  useEffect(() => {
    if (!eventsLoading && !trainersLoading && !partnersLoading && !eventCategoriesLoading) {
      // Hitung statistik dasar
      const totalEvents = events.length
      const totalTrainers = trainers.length
      const totalPartners = partners.length
      const totalEventCategories = eventCategories.length

      // Hitung total pendapatan dari semua event
      const totalRevenue = events.reduce((sum, event) => sum + event.price * event.enrolled, 0)

      // Hitung total peserta
      const totalParticipants = events.reduce((sum, event) => sum + event.enrolled, 0)

      // Ambil event terbaru (5 terakhir)
      const recentEvents = [...events].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)

      // Perbarui state statistik
      setStats({
        totalOrders: 0,
        totalRevenue,
        totalUsers: totalParticipants,
        totalProducts: 0,
        totalEvents,
        totalTrainers,
        totalPartners,
        totalEventCategories,
        recentOrders: [],
        recentEvents,
        topProducts: [],
        salesByDay: [],
      })

      setLoading(false)
    }
  }, [
    events,
    trainers,
    partners,
    eventCategories,
    eventsLoading,
    trainersLoading,
    partnersLoading,
    eventCategoriesLoading,
  ])

  // Tampilkan loading state jika data belum siap
  if (loading || eventsLoading || trainersLoading || partnersLoading || eventCategoriesLoading) {
    return <div className="flex items-center justify-center h-full">Memuat data...</div>
  }

  // Hitung jumlah event mendatang dan pelatih aktif
  const upcomingEventsCount = events.filter((event) => event.status === "upcoming").length
  const activeTrainersCount = trainers.filter((trainer) => trainer.status === "active").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard Layanan Pelatihan</h1>
      </div>

      {/* Ikhtisar Statistik */}
      <StatsOverview
        totalEvents={stats.totalEvents}
        totalTrainers={stats.totalTrainers}
        totalPartners={stats.totalPartners}
        totalEventCategories={stats.totalEventCategories}
      />

      {/* Panel Informasi */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Panel Event Terbaru */}
        <RecentEventsPanel events={stats.recentEvents} />

        {/* Panel Statistik Pelatihan */}
        <TrainingStatsPanel
          totalRevenue={stats.totalRevenue}
          totalParticipants={stats.totalUsers}
          upcomingEventsCount={upcomingEventsCount}
          totalEvents={events.length}
          activeTrainersCount={activeTrainersCount}
          totalTrainers={trainers.length}
        />
      </div>

      {/* Panel Pelatih dan Mitra */}
      <div className="grid gap-6 md:grid-cols-2">
        <TopTrainersPanel trainers={trainers.slice(0, 5)} />
        <PartnersPanel partners={partners.slice(0, 5)} />
      </div>
    </div>
  )
}

