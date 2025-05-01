"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, set, remove, push, update } from "firebase/database"
import type { EventCategory, EventCategoryFormData } from "@/lib/types"
import { toast } from "react-toastify"

/**
 * Tipe data untuk context EventCategories
 */
interface EventCategoriesContextType {
  eventCategories: EventCategory[]
  loading: boolean
  addEventCategory: (category: EventCategoryFormData) => Promise<void>
  updateEventCategory: (id: string, category: EventCategoryFormData) => Promise<void>
  deleteEventCategory: (id: string) => Promise<void>
  getEventCategoryById: (id: string) => EventCategory | undefined
}

// Buat context untuk EventCategories
const EventCategoriesContext = createContext<EventCategoriesContextType | undefined>(undefined)

/**
 * Provider untuk EventCategories
 *
 * Menyediakan akses ke data dan operasi kategori event
 */
export function EventCategoriesProvider({ children }: { children: React.ReactNode }) {
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([])
  const [loading, setLoading] = useState(true)

  // Ambil data eventCategories dari Firebase
  useEffect(() => {
    if (!database) {
      setLoading(false)
      toast.error("Firebase database tidak terinisialisasi")
      return () => {}
    }

    const categoriesRef = ref(database, "eventCategories")

    const unsubscribe = onValue(
      categoriesRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const categoriesArray = Object.entries(data).map(([id, category]) => ({
            id,
            ...(category as Omit<EventCategory, "id">),
          }))
          setEventCategories(categoriesArray)
        } else {
          setEventCategories([])
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching event categories data:", error)
        toast.error("Gagal memuat data kategori event")
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  /**
   * Menambahkan kategori event baru
   */
  const addEventCategory = async (category: EventCategoryFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const timestamp = Date.now()
      const newCategory: Omit<EventCategory, "id"> = {
        ...category,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      const newCategoryRef = push(ref(database, "eventCategories"))
      await set(newCategoryRef, newCategory)
      toast.success("Kategori event berhasil ditambahkan")
    } catch (error) {
      console.error("Error adding event category:", error)
      toast.error("Gagal menambahkan kategori event")
      throw error
    }
  }

  /**
   * Memperbarui kategori event yang sudah ada
   */
  const updateEventCategory = async (id: string, category: EventCategoryFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const categoryRef = ref(database, `eventCategories/${id}`)
      await update(categoryRef, {
        ...category,
        updatedAt: Date.now(),
      })
      toast.success("Kategori event berhasil diperbarui")
    } catch (error) {
      console.error("Error updating event category:", error)
      toast.error("Gagal memperbarui kategori event")
      throw error
    }
  }

  /**
   * Menghapus kategori event
   */
  const deleteEventCategory = async (id: string) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const categoryRef = ref(database, `eventCategories/${id}`)
      await remove(categoryRef)
      toast.success("Kategori event berhasil dihapus")
    } catch (error) {
      console.error("Error deleting event category:", error)
      toast.error("Gagal menghapus kategori event")
      throw error
    }
  }

  /**
   * Mendapatkan kategori event berdasarkan ID
   */
  const getEventCategoryById = (id: string) => {
    return eventCategories.find((category) => category.id === id)
  }

  return (
    <EventCategoriesContext.Provider
      value={{
        eventCategories,
        loading,
        addEventCategory,
        updateEventCategory,
        deleteEventCategory,
        getEventCategoryById,
      }}
    >
      {children}
    </EventCategoriesContext.Provider>
  )
}

/**
 * Hook untuk menggunakan EventCategories context
 */
export function useEventCategories() {
  const context = useContext(EventCategoriesContext)
  if (context === undefined) {
    throw new Error("useEventCategories harus digunakan dalam EventCategoriesProvider")
  }
  return context
}

