"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Sun,
  Moon,
  User,
  Bell,
  Menu,
  X,
  Calendar,
  GraduationCap,
  Handshake,
  Tags,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"
import { toast } from "react-toastify"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Logo } from "@/components/logo"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

/**
 * Komponen Sidebar
 *
 * Menampilkan navigasi utama aplikasi dan kontrol pengguna
 */
export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [trainingServicesOpen, setTrainingServicesOpen] = useState(true)

  // Periksa apakah kita berada di perangkat mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Periksa apakah rute layanan pelatihan aktif
  useEffect(() => {
    if (
      pathname === "/events" ||
      pathname === "/trainers" ||
      pathname === "/partners" ||
      pathname === "/event-categories"
    ) {
      setTrainingServicesOpen(true)
    }
  }, [pathname])

  // Definisi rute utama
  const mainRoutes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Pengaturan",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  // Definisi rute layanan pelatihan
  const trainingServicesRoutes = [
    {
      label: "Event",
      icon: Calendar,
      href: "/events",
      active: pathname === "/events",
    },
    {
      label: "Pelatih",
      icon: GraduationCap,
      href: "/trainers",
      active: pathname === "/trainers",
    },
    {
      label: "Mitra",
      icon: Handshake,
      href: "/partners",
      active: pathname === "/partners",
    },
    {
      label: "Kategori Event",
      icon: Tags,
      href: "/event-categories",
      active: pathname === "/event-categories",
    },
  ]

  /**
   * Menangani proses logout
   */
  const handleLogout = async () => {
    try {
      await logout()
      // Toast ditangani di auth provider
    } catch (error) {
      console.error("Failed to logout:", error)
      toast.error("Gagal logout. Silakan coba lagi.")
    }
  }

  /**
   * Komponen konten sidebar
   * Digunakan baik di desktop maupun mobile
   */
  const SidebarContent = () => (
    <>
      <div className="p-5 border-b flex items-center justify-between">
        <Logo size="md" />
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 px-3 py-6">
        <nav className="space-y-1">
          {/* Rute utama */}
          {mainRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all hover:bg-accent ${
                route.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => isMobile && setMobileMenuOpen(false)}
            >
              <route.icon className={`h-4 w-4 ${route.active ? "text-primary" : ""}`} />
              {route.label}
            </Link>
          ))}

          {/* Bagian Layanan Pelatihan yang dapat dilipat */}
          <Collapsible open={trainingServicesOpen} onOpenChange={setTrainingServicesOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <button
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-all hover:bg-accent ${
                  trainingServicesRoutes.some((route) => route.active)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap
                    className={`h-4 w-4 ${trainingServicesRoutes.some((route) => route.active) ? "text-primary" : ""}`}
                  />
                  <span>Layanan Pelatihan</span>
                </div>
                {trainingServicesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 mt-1">
              {trainingServicesRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-accent ${
                    route.active
                      ? "bg-primary/5 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  <route.icon className={`h-4 w-4 ${route.active ? "text-primary" : ""}`} />
                  {route.label}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </div>

      <div className="p-4 border-t">
        {/* Pengaturan tema */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Tema</span>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Notifikasi */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Notifikasi</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Event baru dijadwalkan</DropdownMenuItem>
              <DropdownMenuItem>Pelatih baru terdaftar</DropdownMenuItem>
              <DropdownMenuItem>Permintaan kemitraan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profil pengguna */}
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg border bg-card/50">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">Akun</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tombol logout */}
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  )

  // Untuk tampilan desktop
  if (!isMobile) {
    return (
      <div className="hidden md:flex flex-col h-full w-64 bg-background border-r">
        <SidebarContent />
      </div>
    )
  }

  // Untuk tampilan mobile
  return (
    <>
      {/* Header mobile */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-background border-b md:hidden">
        <Logo size="sm" />
        <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 sm:max-w-[280px] h-screen block" side="left">
            <div className="flex flex-col h-full bg-background">
              <SidebarContent />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Spacer untuk header mobile */}
      <div className="h-16 md:hidden"></div>
    </>
  )
}

