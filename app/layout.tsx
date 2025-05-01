import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Font Inter dengan subset Latin
const inter = Inter({ subsets: ["latin"] })

// Metadata untuk SEO
export const metadata: Metadata = {
  title: "TrainHub | Manajemen Layanan Pelatihan",
  description: "Platform manajemen layanan pelatihan yang elegan dan minimalis",
    generator: 'v0.dev'
}

/**
 * Layout Root
 *
 * Layout utama yang membungkus seluruh aplikasi
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <ToastContainer
              position="top-right"
              theme="colored"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

