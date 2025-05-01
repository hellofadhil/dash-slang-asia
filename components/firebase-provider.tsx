"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { toast } from "react-toastify"

/**
 * Tipe data untuk context Firebase
 */
interface FirebaseContextType {
  loading: boolean
}

// Buat context untuk Firebase
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

/**
 * Provider untuk Firebase
 *
 * Menyediakan status koneksi Firebase ke seluruh aplikasi
 */
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /**
     * Memeriksa koneksi ke Firebase
     */
    const checkConnection = () => {
      if (!database) {
        setLoading(false)
        toast.error("Firebase database tidak terinisialisasi. Silakan periksa konfigurasi Anda.")
        return
      }

      // Referensi ke status koneksi Firebase
      const connectedRef = ref(database, ".info/connected")

      // Pantau status koneksi
      const unsubscribe = onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          setLoading(false)
        } else {
          toast.warning("Menghubungkan ke database Firebase...")
        }
      })

      return () => {
        unsubscribe()
      }
    }

    // Beri waktu sebentar sebelum memeriksa koneksi
    const timeout = setTimeout(checkConnection, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <FirebaseContext.Provider
      value={{
        loading,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

/**
 * Hook untuk menggunakan Firebase context
 */
export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error("useFirebase harus digunakan dalam FirebaseProvider")
  }
  return context
}

