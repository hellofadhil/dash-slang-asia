"use client"

import type React from "react"

import { useState } from "react"
import { usePartners } from "@/components/partners-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Edit, Trash2, Plus, Filter, Globe, Mail, Phone } from "lucide-react"
import type { Partner, PartnerFormData } from "@/lib/types"

export function PartnersPage() {
  const { partners, loading, addPartner, updatePartner, deletePartner } = usePartners()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter partners based on search query and filters
  const filteredPartners = partners.filter((partner) => {
    // Apply search filter
    if (
      searchQuery &&
      !partner.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !partner.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Apply status filter
    if (statusFilter !== "all" && partner.status !== statusFilter) {
      return false
    }

    // Apply type filter
    if (typeFilter !== "all" && partner.type !== typeFilter) {
      return false
    }

    return true
  })

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      await deletePartner(id)
    }
  }

  const typeColors: Record<string, string> = {
    corporate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    academic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    nonprofit: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    government: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Partner Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8"
            />
          </div>

          <div className="md:hidden">
            <Button variant="outline" className="w-full justify-between" onClick={() => setShowFilters(!showFilters)}>
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </span>
            </Button>
          </div>

          <div className={`space-y-4 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No partners found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={partner.logo || "/placeholder.svg"} alt={partner.name} />
                              <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{partner.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                {partner.website && (
                                  <>
                                    <Globe className="h-3 w-3" />
                                    <a
                                      href={partner.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline"
                                    >
                                      Website
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={typeColors[partner.type] || ""}>
                            {partner.type.charAt(0).toUpperCase() + partner.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {partner.contactName && <div className="text-sm">{partner.contactName}</div>}
                          {partner.contactEmail && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {partner.contactEmail}
                            </div>
                          )}
                          {partner.contactPhone && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {partner.contactPhone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={partner.status === "active" ? "default" : "secondary"}
                            className={
                              partner.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }
                          >
                            {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(partner)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(partner.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <PartnerDialog open={showAddDialog} onOpenChange={setShowAddDialog} mode="add" onSubmit={addPartner} />

      {editingPartner && (
        <PartnerDialog
          open={!!editingPartner}
          onOpenChange={(open) => {
            if (!open) setEditingPartner(null)
          }}
          mode="edit"
          partner={editingPartner}
          onSubmit={(data) => updatePartner(editingPartner.id, data)}
        />
      )}
    </div>
  )
}

interface PartnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  partner?: Partner
  onSubmit: (data: PartnerFormData) => Promise<void>
}

function PartnerDialog({ open, onOpenChange, mode, partner, onSubmit }: PartnerDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PartnerFormData>({
    name: partner?.name || "",
    description: partner?.description || "",
    type: partner?.type || "corporate",
    website: partner?.website || "",
    logo: partner?.logo || "",
    contactName: partner?.contactName || "",
    contactEmail: partner?.contactEmail || "",
    contactPhone: partner?.contactPhone || "",
    status: partner?.status || "active",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving partner:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-4">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Add Partner" : "Edit Partner"}</DialogTitle>
            <DialogDescription>
              {mode === "add" ? "Add a new partner organization" : "Make changes to the partner details"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Partner Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Partner Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleSelectChange("type", value as "corporate" | "academic" | "nonprofit" | "government")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website || ""}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL (Optional)</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Information (Optional)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    name="contactName"
                    placeholder="Contact Name"
                    value={formData.contactName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Input
                    name="contactEmail"
                    type="email"
                    placeholder="Contact Email"
                    value={formData.contactEmail || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Input
                    name="contactPhone"
                    placeholder="Contact Phone"
                    value={formData.contactPhone || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value as "active" | "inactive")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "add" ? "Add Partner" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

