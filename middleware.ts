import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Konstanta untuk rute Firebase Auth
 * Memisahkan nilai-nilai konstan untuk memudahkan pemeliharaan
 */
const FIREBASE_AUTH_PATH = "/__/auth/action"
const VERIFY_EMAIL_MODE = "verifyEmail"
const CUSTOM_VERIFY_SUCCESS_PATH = "/auth/verify-success"

/**
 * Memeriksa apakah request adalah untuk verifikasi email Firebase
 * @param request - Request dari Next.js
 * @returns boolean - true jika request adalah untuk verifikasi email
 */
function isFirebaseEmailVerification(request: NextRequest): boolean {
  return (
    request.nextUrl.pathname.includes(FIREBASE_AUTH_PATH) &&
    request.nextUrl.searchParams.has("mode") &&
    request.nextUrl.searchParams.get("mode") === VERIFY_EMAIL_MODE
  )
}

/**
 * Membuat URL redirect untuk halaman verifikasi sukses
 * @param originalUrl - URL asli dari request
 * @returns URL - URL yang sudah dimodifikasi untuk redirect
 */
function createVerificationSuccessUrl(originalUrl: URL): URL {
  const redirectUrl = originalUrl.clone()

  // Ubah path ke halaman verifikasi sukses kustom
  redirectUrl.pathname = CUSTOM_VERIFY_SUCCESS_PATH

  // Pertahankan parameter email jika ada
  const email = originalUrl.searchParams.get("email")
  if (email) {
    redirectUrl.searchParams.set("email", email)
  }

  return redirectUrl
}

/**
 * Middleware untuk menangani rute khusus Firebase Authentication
 *
 * Fungsi ini menangkap permintaan ke rute Firebase Auth dan mengalihkannya
 * ke halaman kustom aplikasi kita.
 */
export function middleware(request: NextRequest) {
  // Jika request adalah untuk verifikasi email Firebase
  if (isFirebaseEmailVerification(request)) {
    // Buat URL untuk redirect ke halaman sukses verifikasi
    const redirectUrl = createVerificationSuccessUrl(request.nextUrl)

    // Lakukan redirect
    return NextResponse.redirect(redirectUrl)
  }

  // Untuk request lainnya, lanjutkan ke handler berikutnya
  return NextResponse.next()
}

/**
 * Konfigurasi untuk menentukan rute mana yang akan diproses oleh middleware
 *
 * Pola matcher menggunakan regex untuk mencocokkan semua rute yang dimulai dengan
 * /__/auth/action diikuti oleh karakter apapun
 */
export const config = {
  matcher: ["/__/auth/action(.*)"],
}

