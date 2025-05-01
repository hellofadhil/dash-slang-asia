"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"

/**
 * Komponen ProtectedRoute
 *
 * Melindungi rute agar hanya dapat diakses oleh pengguna yang sudah login
 * Jika pengguna belum login, akan diarahkan ke halaman login
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect ke halaman login jika user belum login
    if (!loading && !user) {
      toast.info("Silakan login untuk mengakses dashboard")
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // Tampilkan loading spinner saat memeriksa status autentikasi
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Memuat...</span>
      </div>
    )
  }

  // Jangan render apa-apa jika user belum login
  if (!user) {
    return null
  }

  // Render children jika user sudah login
  return <>{children}</>
}

