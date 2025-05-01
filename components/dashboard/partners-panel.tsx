import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import Link from "next/link"
import type { Partner } from "@/lib/types"

interface PartnersPanelProps {
  partners: Partner[]
}

/**
 * Komponen PartnersPanel
 *
 * Menampilkan daftar mitra dalam panel
 */
export function PartnersPanel({ partners }: PartnersPanelProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Mitra</h3>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href="/partners">Lihat semua</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {partners.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Belum ada mitra</p>
          ) : (
            <div className="space-y-4">
              {partners.map((partner) => (
                <PartnerListItem key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface PartnerListItemProps {
  partner: Partner
}

/**
 * Komponen PartnerListItem
 *
 * Menampilkan satu item mitra dalam daftar
 */
function PartnerListItem({ partner }: PartnerListItemProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={partner.logo || "/placeholder.svg"} alt={partner.name} />
          <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{partner.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{partner.type}</p>
        </div>
      </div>
      <StatusBadge status={partner.status} />
    </div>
  )
}

