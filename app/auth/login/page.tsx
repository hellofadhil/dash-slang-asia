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
import { useRouter } from "next/navigation"

/**
 * Halaman Login
 *
 * Menampilkan form login untuk pengguna yang sudah terdaftar
 */
export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [firebaseInitialized, setFirebaseInitialized] = useState(true)
  const router = useRouter()

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
   * Menangani submit form login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseInitialized) {
      toast.error("Tidak dapat login: Firebase authentication tidak terinisialisasi")
      return
    }

    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      console.error("Login error:", err)

      // Tangani error Firebase auth dengan pesan yang ramah pengguna
      if (err.message.includes("auth/invalid-credential")) {
        toast.error("Email atau password tidak valid. Silakan coba lagi.")
      } else if (err.message.includes("auth/user-not-found")) {
        toast.error("Akun tidak ditemukan. Silakan daftar terlebih dahulu.")
      } else if (err.message.includes("auth/wrong-password")) {
        toast.error("Password yang Anda masukkan salah.")
      } else if (err.message.includes("auth/email-not-verified")) {
        toast.error("Silakan verifikasi email Anda sebelum login.")
        // Redirect ke halaman verifikasi email
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
      } else if (err.message.includes("auth/too-many-requests")) {
        toast.error("Terlalu banyak percobaan login yang gagal. Silakan coba lagi nanti atau reset password Anda.")
      } else {
        toast.error(err.message || "Gagal login")
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
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Masukkan email dan password untuk mengakses akun Anda
            </CardDescription>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Lupa password?
                  </Link>
                </div>
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

              {/* Tombol Login */}
              <Button type="submit" className="w-full" disabled={!firebaseInitialized || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sedang login...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm mt-2">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Daftar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

