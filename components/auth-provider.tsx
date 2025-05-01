"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "react-toastify"

/**
 * Tipe data untuk context autentikasi
 */
interface AuthContextType {
  user: User | null
  loading: boolean
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
}

// Buat context untuk autentikasi
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider untuk autentikasi
 *
 * Mengelola status autentikasi pengguna dan menyediakan fungsi-fungsi autentikasi
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Periksa apakah auth sudah diinisialisasi
    if (!auth) {
      toast.error("Firebase authentication gagal diinisialisasi. Silakan periksa konfigurasi Anda.")
      setLoading(false)
      return () => {}
    }

    // Pantau perubahan status autentikasi
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)

        // Logika redirect - hanya redirect ke dashboard jika user terverifikasi
        if (!currentUser && !pathname.includes("/auth/")) {
          router.push("/auth/login")
        } else if (currentUser && pathname.includes("/auth/")) {
          // Hanya redirect ke dashboard jika email terverifikasi
          if (currentUser.emailVerified) {
            router.push("/")
          } else if (!pathname.includes("/auth/verify-email")) {
            // Jika email belum terverifikasi dan tidak di halaman verify-email, redirect ke halaman verify-email
            router.push("/auth/verify-email")
          }
        }
      },
      (error) => {
        console.error("Auth state change error:", error)
        toast.error("Authentication error: " + error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [pathname, router])

  /**
   * Mendaftarkan pengguna baru
   */
  const register = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase authentication tidak terinisialisasi")

    try {
      // Buat user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Kirim email verifikasi menggunakan metode bawaan Firebase
      await sendEmailVerification(user)

      // Kirim juga email kustom menggunakan API route kita
      try {
        // Generate link verifikasi - Firebase akan menangani ini secara otomatis
        // tapi kita juga mengirim email kustom kita sendiri
        const verificationLink = `${window.location.origin}/auth/verify-email?email=${encodeURIComponent(email)}`

        await fetch("/api/send-verification-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            verificationLink,
          }),
        })
      } catch (emailError) {
        console.error("Error sending custom verification email:", emailError)
        // Lanjutkan meskipun email kustom gagal, karena email Firebase sudah terkirim
      }

      // Redirect ke halaman verifikasi
      router.push("/auth/verify-email")

      toast.success("Akun berhasil dibuat! Silakan periksa email Anda untuk memverifikasi akun.")
    } catch (error: any) {
      console.error("Registration error:", error)
      throw error
    }
  }

  /**
   * Login pengguna
   */
  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase authentication tidak terinisialisasi")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Periksa apakah email sudah diverifikasi
      if (!user.emailVerified) {
        // Logout user jika email belum diverifikasi
        await signOut(auth)
        throw new Error("auth/email-not-verified")
      }

      toast.success("Login berhasil!")
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)

      // Tangani error khusus untuk email yang belum diverifikasi
      if (error.message === "auth/email-not-verified") {
        throw new Error("auth/email-not-verified")
      }

      throw error
    }
  }

  /**
   * Logout pengguna
   */
  const logout = async () => {
    if (!auth) throw new Error("Firebase authentication tidak terinisialisasi")

    try {
      await signOut(auth)
      toast.info("Anda telah logout")
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Logout error:", error)
      toast.error("Logout gagal: " + error.message)
      throw error
    }
  }

  /**
   * Reset password pengguna
   */
  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Firebase authentication tidak terinisialisasi")

    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  /**
   * Kirim email verifikasi
   */
  const sendVerificationEmail = async () => {
    if (!auth || !auth.currentUser) throw new Error("Tidak ada user yang terautentikasi")

    try {
      await sendEmailVerification(auth.currentUser)

      // Kirim juga email kustom
      try {
        const email = auth.currentUser.email
        const verificationLink = `${window.location.origin}/auth/verify-email?email=${encodeURIComponent(email || "")}`

        await fetch("/api/send-verification-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            verificationLink,
          }),
        })
      } catch (emailError) {
        console.error("Error sending custom verification email:", emailError)
      }

      toast.success("Email verifikasi terkirim! Silakan periksa kotak masuk Anda.")
    } catch (error: any) {
      console.error("Error sending verification email:", error)
      toast.error("Gagal mengirim email verifikasi: " + error.message)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        resetPassword,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook untuk menggunakan Auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth harus digunakan dalam AuthProvider")
  }
  return context
}

