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
 * Halaman Lupa Password
 *
 * Menampilkan form untuk meminta reset password
 */
export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
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
   * Menangani submit form reset password
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await resetPassword(email)
      toast.success("Email reset password terkirim! Periksa kotak masuk Anda untuk instruksi.")
      setEmail("")
    } catch (err: any) {
      console.error("Password reset error:", err)

      // Tangani error Firebase auth dengan pesan yang ramah pengguna
      if (err.message.includes("auth/user-not-found")) {
        toast.error("Tidak ditemukan akun dengan alamat email ini.")
      } else if (err.message.includes("auth/invalid-email")) {
        toast.error("Alamat email tidak valid. Silakan periksa dan coba lagi.")
      } else {
        toast.error(err.message || "Gagal mengirim email reset password")
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
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Masukkan alamat email Anda dan kami akan mengirimkan link untuk reset password
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

              {/* Tombol Kirim Link Reset */}
              <Button type="submit" className="w-full" disabled={!firebaseInitialized || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim link reset...
                  </>
                ) : (
                  "Kirim Link Reset"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm mt-2">
              <Link href="/auth/login" className="text-primary hover:underline">
                Kembali ke login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

