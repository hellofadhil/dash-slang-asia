"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, set, remove, push, update } from "firebase/database"
import type { Event, EventFormData } from "@/lib/types"
import { toast } from "react-toastify"

/**
 * Tipe data untuk context Events
 */
interface EventsContextType {
  events: Event[]
  loading: boolean
  addEvent: (event: EventFormData) => Promise<void>
  updateEvent: (id: string, event: EventFormData) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  getEventById: (id: string) => Event | undefined
}

// Buat context untuk Events
const EventsContext = createContext<EventsContextType | undefined>(undefined)

/**
 * Provider untuk Events
 *
 * Menyediakan akses ke data dan operasi event
 */
export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // Ambil data events dari Firebase
  useEffect(() => {
    if (!database) {
      setLoading(false)
      toast.error("Firebase database tidak terinisialisasi")
      return () => {}
    }

    const eventsRef = ref(database, "events")

    const unsubscribe = onValue(
      eventsRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const eventsArray = Object.entries(data).map(([id, event]) => ({
            id,
            ...(event as Omit<Event, "id">),
          }))
          setEvents(eventsArray)
        } else {
          setEvents([])
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching events data:", error)
        toast.error("Gagal memuat data events")
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  /**
   * Menambahkan event baru
   */
  const addEvent = async (event: EventFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const timestamp = Date.now()
      const newEvent: Omit<Event, "id"> = {
        ...event,
        createdAt: timestamp,
        updatedAt: timestamp,
        categoryName: "", // Akan diisi saat menampilkan
        trainerName: "", // Akan diisi saat menampilkan
        partnerName: event.partnerId ? "" : undefined, // Akan diisi saat menampilkan
      }

      const newEventRef = push(ref(database, "events"))
      await set(newEventRef, newEvent)
      toast.success("Event berhasil ditambahkan")
    } catch (error) {
      console.error("Error adding event:", error)
      toast.error("Gagal menambahkan event")
      throw error
    }
  }

  /**
   * Memperbarui event yang sudah ada
   */
  const updateEvent = async (id: string, event: EventFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const eventRef = ref(database, `events/${id}`)
      await update(eventRef, {
        ...event,
        updatedAt: Date.now(),
      })
      toast.success("Event berhasil diperbarui")
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error("Gagal memperbarui event")
      throw error
    }
  }

  /**
   * Menghapus event
   */
  const deleteEvent = async (id: string) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const eventRef = ref(database, `events/${id}`)
      await remove(eventRef)
      toast.success("Event berhasil dihapus")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Gagal menghapus event")
      throw error
    }
  }

  /**
   * Mendapatkan event berdasarkan ID
   */
  const getEventById = (id: string) => {
    return events.find((event) => event.id === id)
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventById,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

/**
 * Hook untuk menggunakan Events context
 */
export function useEvents() {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error("useEvents harus digunakan dalam EventsProvider")
  }
  return context
}

