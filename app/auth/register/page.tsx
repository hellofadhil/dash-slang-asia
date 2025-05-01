"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase"
import { toast } from "react-toastify"

/**
 * Halaman Pendaftaran
 *
 * Menampilkan form pendaftaran untuk pengguna baru
 */
export default function RegisterPage() {
  const { register } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [firebaseInitialized, setFirebaseInitialized] = useState(true)

  // Periksa apakah Firebase Auth sudah diinisialisasi
  useEffect(() => {
    if (!auth) {
      setFirebaseInitialized(false)
      toast.error("Firebase authentication tidak terinisialisasi. Silakan periksa konfigurasi Anda.")
    } else {
      setFirebaseInitialized(true)
    }
  }, [])

  /**
   * Menangani submit form pendaftaran
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseInitialized) {
      toast.error("Tidak dapat mendaftar: Firebase authentication tidak terinisialisasi")
      return
    }

    // Validasi password
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok")
      return
    }

    if (password.length < 6) {
      toast.error("Password harus minimal 6 karakter")
      return
    }

    setLoading(true)

    try {
      await register(email, password)
      // Toast sukses ditampilkan di fungsi register
      // Pengguna diarahkan ke halaman verify-email
    } catch (err: any) {
      console.error("Registration error:", err)

      // Tangani error Firebase auth dengan pesan yang ramah pengguna
      if (err.message.includes("auth/email-already-in-use")) {
        toast.error("Email ini sudah terdaftar. Silakan login.")
      } else if (err.message.includes("auth/invalid-email")) {
        toast.error("Alamat email tidak valid. Silakan periksa dan coba lagi.")
      } else if (err.message.includes("auth/weak-password")) {
        toast.error("Password terlalu lemah. Silakan gunakan password yang lebih kuat.")
      } else {
        toast.error(err.message || "Gagal membuat akun")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Buat akun</CardTitle>
            <CardDescription className="text-center">Masukkan email dan password untuk mendaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!firebaseInitialized || loading}
                />
              </div>

              {/* Input Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!firebaseInitialized || loading}
                />
              </div>

              {/* Input Konfirmasi Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!firebaseInitialized || loading}
                />
              </div>

              {/* Tombol Daftar */}
              <Button type="submit" className="w-full" disabled={!firebaseInitialized || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Membuat akun...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm mt-2">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

