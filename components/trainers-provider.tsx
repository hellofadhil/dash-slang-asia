"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, set, remove, push, update } from "firebase/database"
import type { Trainer, TrainerFormData } from "@/lib/types"
import { toast } from "react-toastify"

/**
 * Tipe data untuk context Trainers
 */
interface TrainersContextType {
  trainers: Trainer[]
  loading: boolean
  addTrainer: (trainer: TrainerFormData) => Promise<void>
  updateTrainer: (id: string, trainer: TrainerFormData) => Promise<void>
  deleteTrainer: (id: string) => Promise<void>
  getTrainerById: (id: string) => Trainer | undefined
}

// Buat context untuk Trainers
const TrainersContext = createContext<TrainersContextType | undefined>(undefined)

/**
 * Provider untuk Trainers
 *
 * Menyediakan akses ke data dan operasi pelatih
 */
export function TrainersProvider({ children }: { children: React.ReactNode }) {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)

  // Ambil data trainers dari Firebase
  useEffect(() => {
    if (!database) {
      setLoading(false)
      toast.error("Firebase database tidak terinisialisasi")
      return () => {}
    }

    const trainersRef = ref(database, "trainers")

    const unsubscribe = onValue(
      trainersRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const trainersArray = Object.entries(data).map(([id, trainer]) => ({
            id,
            ...(trainer as Omit<Trainer, "id">),
          }))
          setTrainers(trainersArray)
        } else {
          setTrainers([])
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching trainers data:", error)
        toast.error("Gagal memuat data pelatih")
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  /**
   * Menambahkan pelatih baru
   */
  const addTrainer = async (trainer: TrainerFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const timestamp = Date.now()
      const newTrainer: Omit<Trainer, "id"> = {
        ...trainer,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      const newTrainerRef = push(ref(database, "trainers"))
      await set(newTrainerRef, newTrainer)
      toast.success("Pelatih berhasil ditambahkan")
    } catch (error) {
      console.error("Error adding trainer:", error)
      toast.error("Gagal menambahkan pelatih")
      throw error
    }
  }

  /**
   * Memperbarui pelatih yang sudah ada
   */
  const updateTrainer = async (id: string, trainer: TrainerFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const trainerRef = ref(database, `trainers/${id}`)
      await update(trainerRef, {
        ...trainer,
        updatedAt: Date.now(),
      })
      toast.success("Pelatih berhasil diperbarui")
    } catch (error) {
      console.error("Error updating trainer:", error)
      toast.error("Gagal memperbarui pelatih")
      throw error
    }
  }

  /**
   * Menghapus pelatih
   */
  const deleteTrainer = async (id: string) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const trainerRef = ref(database, `trainers/${id}`)
      await remove(trainerRef)
      toast.success("Pelatih berhasil dihapus")
    } catch (error) {
      console.error("Error deleting trainer:", error)
      toast.error("Gagal menghapus pelatih")
      throw error
    }
  }

  /**
   * Mendapatkan pelatih berdasarkan ID
   */
  const getTrainerById = (id: string) => {
    return trainers.find((trainer) => trainer.id === id)
  }

  return (
    <TrainersContext.Provider
      value={{
        trainers,
        loading,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        getTrainerById,
      }}
    >
      {children}
    </TrainersContext.Provider>
  )
}

/**
 * Hook untuk menggunakan Trainers context
 */
export function useTrainers() {
  const context = useContext(TrainersContext)
  if (context === undefined) {
    throw new Error("useTrainers harus digunakan dalam TrainersProvider")
  }
  return context
}

