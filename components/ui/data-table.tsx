"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

/**
 * Definisi kolom untuk DataTable
 */
interface DataTableColumn<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchField?: keyof T
  emptyMessage?: string
  onRowClick?: (item: T) => void
  isLoading?: boolean
}

/**
 * Komponen DataTable yang dapat digunakan kembali
 *
 * Komponen ini menyediakan tabel data dengan fitur pencarian dan dapat dikustomisasi
 * untuk berbagai jenis data.
 */
export function DataTable<T>({
  data,
  columns,
  searchField,
  emptyMessage = "Tidak ada data",
  onRowClick,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter data berdasarkan query pencarian jika searchField disediakan
  const filteredData = searchField
    ? data.filter((item) => {
        const fieldValue = item[searchField] as unknown as string
        return fieldValue?.toLowerCase().includes(searchQuery.toLowerCase())
      })
    : data

  // Render cell berdasarkan accessor (bisa berupa key atau fungsi)
  const renderCell = (item: T, accessor: keyof T | ((item: T) => React.ReactNode)) => {
    if (typeof accessor === "function") {
      return accessor(item)
    }
    return item[accessor] as unknown as React.ReactNode
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-40">Memuat data...</div>
  }

  return (
    <div className="space-y-4">
      {/* Tampilkan pencarian hanya jika searchField disediakan */}
      {searchField && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {renderCell(item, column.accessor)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

