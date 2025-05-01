import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import type { Event } from "@/lib/types"

interface RecentEventsPanelProps {
  events: Event[]
}

/**
 * Komponen RecentEventsPanel
 *
 * Menampilkan daftar event terbaru dalam panel
 */
export function RecentEventsPanel({ events }: RecentEventsPanelProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Event Terbaru</h3>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href="/events">Lihat semua</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Belum ada event</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface EventListItemProps {
  event: Event
}

/**
 * Komponen EventListItem
 *
 * Menampilkan satu item event dalam daftar
 */
function EventListItem({ event }: EventListItemProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={event.image || "/placeholder.svg"} alt={event.title} />
          <AvatarFallback>{event.title.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{event.title}</p>
          <p className="text-xs text-muted-foreground">{formatDate(event.startDate)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-medium">{formatCurrency(event.price)}</p>
        <StatusBadge status={event.status} />
      </div>
    </div>
  )
}

