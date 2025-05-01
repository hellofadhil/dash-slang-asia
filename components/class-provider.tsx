"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, set, remove, push, update } from "firebase/database"
import { toast } from "react-toastify"
import type { Class, ClassFormData } from "@/lib/types"

/**
 * Tipe data untuk context Class
 */
interface ClassesContextType {
  classes: Class[]
  loading: boolean
  addClass: (classData: ClassFormData) => Promise<void>
  updateClass: (id: string, classData: ClassFormData) => Promise<void>
  deleteClass: (id: string) => Promise<void>
  getClassById: (id: string) => Class | undefined
}

// Buat context untuk Class
const ClassesContext = createContext<ClassesContextType | undefined>(undefined)

/**
 * Provider untuk Classes
 *
 * Menyediakan akses ke data dan operasi kelas
 */
export function ClassesProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  // Ambil data kelas dari Firebase
  useEffect(() => {
    if (!database) {
      setLoading(false)
      toast.error("Firebase database tidak terinisialisasi")
      return () => {}
    }

    const classesRef = ref(database, "classes")

    const unsubscribe = onValue(
      classesRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const classesArray = Object.entries(data).map(([id, classData]) => ({
            id,
            ...(classData as Omit<Class, "id">),
          }))
          setClasses(classesArray)
        } else {
          setClasses([])
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching classes data:", error)
        toast.error("Gagal memuat data kelas")
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  /**
   * Menambahkan kelas baru
   */
  const addClass = async (classData: ClassFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const timestamp = Date.now()
      const newClass: Omit<Class, "id"> = {
        ...classData,
        startDate: classData.startDate,
        endDate: classData.endDate,
        price: classData.price,
        status: classData.status,
        image: classData.image,
        color: classData.color,
        icon: classData.icon,
      }

      const newClassRef = push(ref(database, "classes"))
      await set(newClassRef, newClass)
      toast.success("Kelas berhasil ditambahkan")
    } catch (error) {
      console.error("Error adding class:", error)
      toast.error("Gagal menambahkan kelas")
      throw error
    }
  }

  /**
   * Memperbarui kelas yang sudah ada
   */
  const updateClass = async (id: string, classData: ClassFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const classRef = ref(database, `classes/${id}`)
      await update(classRef, {
        ...classData,
        updatedAt: Date.now(),
      })
      toast.success("Kelas berhasil diperbarui")
    } catch (error) {
      console.error("Error updating class:", error)
      toast.error("Gagal memperbarui kelas")
      throw error
    }
  }

  /**
   * Menghapus kelas
   */
  const deleteClass = async (id: string) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const classRef = ref(database, `classes/${id}`)
      await remove(classRef)
      toast.success("Kelas berhasil dihapus")
    } catch (error) {
      console.error("Error deleting class:", error)
      toast.error("Gagal menghapus kelas")
      throw error
    }
  }

  /**
   * Mendapatkan kelas berdasarkan ID
   */
  const getClassById = (id: string) => {
    return classes.find((classItem) => classItem.id === id)
  }

  return (
    <ClassesContext.Provider
      value={{
        classes,
        loading,
        addClass,
        updateClass,
        deleteClass,
        getClassById,
      }}
    >
      {children}
    </ClassesContext.Provider>
  )
}

/**
 * Hook untuk menggunakan Classes context
 */
export function useClasses() {
  const context = useContext(ClassesContext)
  if (context === undefined) {
    throw new Error("useClasses harus digunakan dalam ClassesProvider")
  }
  return context
}
