"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, set, remove, push, update } from "firebase/database"
import type { Partner, PartnerFormData } from "@/lib/types"
import { toast } from "react-toastify"

/**
 * Tipe data untuk context Partners
 */
interface PartnersContextType {
  partners: Partner[]
  loading: boolean
  addPartner: (partner: PartnerFormData) => Promise<void>
  updatePartner: (id: string, partner: PartnerFormData) => Promise<void>
  deletePartner: (id: string) => Promise<void>
  getPartnerById: (id: string) => Partner | undefined
}

// Buat context untuk Partners
const PartnersContext = createContext<PartnersContextType | undefined>(undefined)

/**
 * Provider untuk Partners
 *
 * Menyediakan akses ke data dan operasi mitra
 */
export function PartnersProvider({ children }: { children: React.ReactNode }) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  // Ambil data partners dari Firebase
  useEffect(() => {
    if (!database) {
      setLoading(false)
      toast.error("Firebase database tidak terinisialisasi")
      return () => {}
    }

    const partnersRef = ref(database, "partners")

    const unsubscribe = onValue(
      partnersRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const partnersArray = Object.entries(data).map(([id, partner]) => ({
            id,
            ...(partner as Omit<Partner, "id">),
          }))
          setPartners(partnersArray)
        } else {
          setPartners([])
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching partners data:", error)
        toast.error("Gagal memuat data mitra")
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  /**
   * Menambahkan mitra baru
   */
  const addPartner = async (partner: PartnerFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const timestamp = Date.now()
      const newPartner: Omit<Partner, "id"> = {
        ...partner,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      const newPartnerRef = push(ref(database, "partners"))
      await set(newPartnerRef, newPartner)
      toast.success("Mitra berhasil ditambahkan")
    } catch (error) {
      console.error("Error adding partner:", error)
      toast.error("Gagal menambahkan mitra")
      throw error
    }
  }

  /**
   * Memperbarui mitra yang sudah ada
   */
  const updatePartner = async (id: string, partner: PartnerFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const partnerRef = ref(database, `partners/${id}`)
      await update(partnerRef, {
        ...partner,
        updatedAt: Date.now(),
      })
      toast.success("Mitra berhasil diperbarui")
    } catch (error) {
      console.error("Error updating partner:", error)
      toast.error("Gagal memperbarui mitra")
      throw error
    }
  }

  /**
   * Menghapus mitra
   */
  const deletePartner = async (id: string) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const partnerRef = ref(database, `partners/${id}`)
      await remove(partnerRef)
      toast.success("Mitra berhasil dihapus")
    } catch (error) {
      console.error("Error deleting partner:", error)
      toast.error("Gagal menghapus mitra")
      throw error
    }
  }

  /**
   * Mendapatkan mitra berdasarkan ID
   */
  const getPartnerById = (id: string) => {
    return partners.find((partner) => partner.id === id)
  }

  return (
    <PartnersContext.Provider
      value={{
        partners,
        loading,
        addPartner,
        updatePartner,
        deletePartner,
        getPartnerById,
      }}
    >
      {children}
    </PartnersContext.Provider>
  )
}

/**
 * Hook untuk menggunakan Partners context
 */
export function usePartners() {
  const context = useContext(PartnersContext)
  if (context === undefined) {
    throw new Error("usePartners harus digunakan dalam PartnersProvider")
  }
  return context
}

