"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { toast } from "react-toastify"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { auth } from "@/lib/firebase"

/**
 * Halaman Verifikasi Email
 *
 * Menampilkan instruksi dan status verifikasi email
 */
export default function VerifyEmailPage() {
  const { user, sendVerificationEmail, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Periksa apakah user sudah terverifikasi
  useEffect(() => {
    if (user?.emailVerified) {
      toast.success("Email Anda sudah terverifikasi! Mengalihkan ke dashboard...")
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }
  }, [user, router])

  // Tangani countdown untuk tombol kirim ulang
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  /**
   * Memeriksa status verifikasi email
   */
  const checkVerificationStatus = async () => {
    setLoading(true)
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload()
        if (auth.currentUser.emailVerified) {
          toast.success("Email Anda sudah terverifikasi! Mengalihkan ke dashboard...")
          setTimeout(() => {
            router.push("/")
          }, 1500)
        } else {
          toast.info("Email Anda belum terverifikasi. Silakan periksa kotak masuk Anda.")
        }
      }
    } catch (error) {
      console.error("Error checking verification status:", error)
      toast.error("Gagal memeriksa status verifikasi")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Mengirim ulang email verifikasi
   */
  const handleResendEmail = async () => {
    setLoading(true)
    try {
      await sendVerificationEmail()
      setResendDisabled(true)
      setCountdown(60) // Nonaktifkan kirim ulang selama 60 detik
    } catch (error) {
      console.error("Error resending verification email:", error)
      toast.error("Gagal mengirim ulang email verifikasi")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Menangani logout
   */
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Jika user sudah terverifikasi, tampilkan pesan sukses
  if (user?.emailVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-4">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Email Terverifikasi!</CardTitle>
              <CardDescription className="text-center">Email Anda telah berhasil diverifikasi.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p>Anda akan dialihkan ke dashboard dalam beberapa saat...</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/">Ke Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Mail className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Verifikasi Email Anda</CardTitle>
            <CardDescription className="text-center">
              Kami telah mengirim email verifikasi ke {user?.email || "alamat email Anda"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>
              Silakan periksa kotak masuk Anda dan klik link verifikasi untuk menyelesaikan pendaftaran. Jika Anda tidak
              melihat email tersebut, periksa folder spam Anda.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={checkVerificationStatus} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memeriksa...
                  </>
                ) : (
                  "Saya sudah verifikasi email"
                )}
              </Button>
              <Button variant="outline" onClick={handleResendEmail} disabled={loading || resendDisabled}>
                {resendDisabled ? `Kirim ulang email (${countdown}d)` : "Kirim ulang email verifikasi"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" onClick={handleLogout}>
              Kembali ke login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

