"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"

/**
 * Komponen SettingsPage
 *
 * Menampilkan pengaturan aplikasi dengan beberapa tab
 */
export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  // State untuk pengaturan notifikasi
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)

  // State untuk informasi toko
  const [storeInfo, setStoreInfo] = useState({
    name: "Toko Ecommerce Saya",
    email: "kontak@tokosaya.com",
    phone: "+62 812 3456 7890",
    address: "Jl. Komersial No. 123, Kota Bisnis, 12345",
    description: "Kami menjual produk berkualitas tinggi dengan harga bersaing.",
  })

  /**
   * Menangani perubahan pada form informasi toko
   */
  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreInfo((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Menyimpan informasi toko
   */
  const handleSaveStoreInfo = () => {
    // Simpan informasi toko ke database
    alert("Informasi toko berhasil disimpan!")
  }

  /**
   * Menyimpan pengaturan notifikasi
   */
  const handleSaveNotifications = () => {
    // Simpan pengaturan notifikasi
    alert("Pengaturan notifikasi berhasil disimpan!")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pengaturan</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="appearance">Tampilan</TabsTrigger>
        </TabsList>

        {/* Tab Pengaturan Umum */}
        <TabsContent value="general" className="space-y-4 pt-4">
          {/* Informasi Toko */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
              <CardDescription>Perbarui detail toko dan informasi kontak Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Toko</Label>
                <Input id="name" name="name" value={storeInfo.name} onChange={handleStoreInfoChange} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Alamat Email</Label>
                <Input id="email" name="email" type="email" value={storeInfo.email} onChange={handleStoreInfoChange} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" name="phone" value={storeInfo.phone} onChange={handleStoreInfoChange} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" name="address" value={storeInfo.address} onChange={handleStoreInfoChange} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi Toko</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={storeInfo.description}
                  onChange={handleStoreInfoChange}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStoreInfo}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>

          {/* Konfigurasi Firebase */}
          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi Firebase</CardTitle>
              <CardDescription>Pengaturan koneksi database Firebase Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input id="apiKey" value="AIzaSyAUUsNaN..." readOnly />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="databaseURL">URL Database</Label>
                  <Input
                    id="databaseURL"
                    value="https://dashboard-manajement-default-rtdb.asia-southeast1.firebasedatabase.app"
                    readOnly
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="projectId">ID Proyek</Label>
                  <Input id="projectId" value="dashboard-manajement" readOnly />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Perbarui Konfigurasi Firebase</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab Pengaturan Notifikasi */}
        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>Konfigurasi bagaimana Anda ingin menerima notifikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Aktifkan Notifikasi</Label>
                  <p className="text-sm text-muted-foreground">Terima notifikasi tentang peristiwa penting</p>
                </div>
                <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="low-stock">Peringatan Stok Rendah</Label>
                  <p className="text-sm text-muted-foreground">Dapatkan notifikasi saat stok produk rendah</p>
                </div>
                <Switch
                  id="low-stock"
                  checked={lowStockAlerts}
                  onCheckedChange={setLowStockAlerts}
                  disabled={!notificationsEnabled}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Simpan Preferensi</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab Pengaturan Tampilan */}
        <TabsContent value="appearance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Tema</CardTitle>
              <CardDescription>Sesuaikan tampilan dashboard Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${theme === "light" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  <div className="h-20 bg-white border rounded-md mb-2"></div>
                  <p className="text-center font-medium">Terang</p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setTheme("dark")}
                >
                  <div className="h-20 bg-slate-950 border rounded-md mb-2"></div>
                  <p className="text-center font-medium">Gelap</p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer ${theme === "system" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setTheme("system")}
                >
                  <div className="h-20 bg-gradient-to-r from-white to-slate-950 border rounded-md mb-2"></div>
                  <p className="text-center font-medium">Sistem</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

