"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, push, set, remove, update } from "firebase/database"
import type { PaymentFile, PaymentFileFormData, PaymentDetail } from "@/lib/types"
import { toast } from "react-toastify"

interface PaymentsContextType {
  payments: PaymentFile[]
  loading: boolean
  addPayment: (data: PaymentFileFormData) => Promise<void>
  updatePayment: (id: string, data: PaymentFileFormData) => Promise<void>
  deletePayment: (id: string) => Promise<void>
  getPaymentById: (id: string) => PaymentFile | undefined
  getPaymentDetailById: (id: string) => Promise<PaymentDetail | undefined>
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined)

export function PaymentsProvider({ children }: { children: React.ReactNode }) {
  const [payments, setPayments] = useState<PaymentFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      setLoading(false)
      return
    }

    const paymentsRef = ref(database, "payment_files")

    const unsubscribe = onValue(
      paymentsRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const paymentsArray = Object.entries(data).map(([id, payment]) => ({
            id,
            ...(payment as Omit<PaymentFile, "id">),
          }))
          setPayments(paymentsArray)
        } else {
          setPayments([])
        }
        setLoading(false)
      },
      (error) => {
        console.error("Gagal mengambil data pembayaran:", error)
        toast.error("Gagal memuat data pembayaran")
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const addPayment = async (data: PaymentFileFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const newRef = push(ref(database, "payment_files"))
      await set(newRef, data)
      toast.success("Pembayaran berhasil ditambahkan")
    } catch (error) {
      console.error("Gagal menambahkan pembayaran:", error)
      toast.error("Gagal menambahkan pembayaran")
      throw error
    }
  }

  const updatePayment = async (id: string, data: PaymentFileFormData) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const updates: Record<string, any> = {
        [`payment_files/${id}`]: data,
      }

      if (data.verificationStatus === "verified") {
        updates[`participants/${data.participantId}/status`] = "accepted"
      }

      await update(ref(database), updates)
      toast.success("Pembayaran berhasil diperbarui dan status peserta diupdate")
    } catch (error) {
      console.error("Gagal memperbarui pembayaran:", error)
      toast.error("Gagal memperbarui pembayaran")
      throw error
    }
  }

  const deletePayment = async (id: string) => {
    if (!database) {
      toast.error("Firebase database tidak terinisialisasi")
      throw new Error("Firebase database tidak terinisialisasi")
    }

    try {
      const paymentRef = ref(database, `payment_files/${id}`)
      await remove(paymentRef)
      toast.success("Pembayaran berhasil dihapus")
    } catch (error) {
      console.error("Gagal menghapus pembayaran:", error)
      toast.error("Gagal menghapus pembayaran")
      throw error
    }
  }

  const getPaymentById = (id: string) => {
    return payments.find((p) => p.id === id)
  }

  const getPaymentDetailById = async (id: string): Promise<PaymentDetail | undefined> => {
    const payment = payments.find((p) => p.id === id)
    if (!payment || !database) return undefined

    try {
      const participantSnap = await new Promise<any>((resolve, reject) => {
        const participantRef = ref(database, `participants/${payment.participantId}`)
        onValue(
          participantRef,
          (snapshot) => resolve(snapshot.val()),
          (error) => reject(error),
          { onlyOnce: true }
        )
      })

      if (!participantSnap) return undefined

      return {
        payment,
        participant: {
          id: payment.participantId,
          ...participantSnap,
        },
      }
    } catch (error) {
      console.error("Gagal mengambil data peserta:", error)
      toast.error("Gagal mengambil data peserta")
      return undefined
    }
  }

  return (
    <PaymentsContext.Provider
      value={{
        payments,
        loading,
        addPayment,
        updatePayment,
        deletePayment,
        getPaymentById,
        getPaymentDetailById,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  )
}

export function usePayments() {
  const context = useContext(PaymentsContext)
  if (!context) {
    throw new Error("usePayments harus digunakan di dalam PaymentsProvider")
  }
  return context
}
