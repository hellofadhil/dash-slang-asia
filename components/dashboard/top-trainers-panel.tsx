import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import type { Trainer } from "@/lib/types"

interface TopTrainersPanelProps {
  trainers: Trainer[]
}

/**
 * Komponen TopTrainersPanel
 *
 * Menampilkan daftar pelatih teratas dalam panel
 */
export function TopTrainersPanel({ trainers }: TopTrainersPanelProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Pelatih Teratas</h3>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href="/trainers">Lihat semua</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {trainers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Belum ada pelatih</p>
          ) : (
            <div className="space-y-4">
              {trainers.map((trainer) => (
                <TrainerListItem key={trainer.id} trainer={trainer} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface TrainerListItemProps {
  trainer: Trainer
}

/**
 * Komponen TrainerListItem
 *
 * Menampilkan satu item pelatih dalam daftar
 */
function TrainerListItem({ trainer }: TrainerListItemProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={trainer.avatar || "/placeholder.svg"} alt={trainer.name} />
          <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{trainer.name}</p>
          <p className="text-xs text-muted-foreground">{trainer.specialization}</p>
        </div>
      </div>
      <StarRating rating={trainer.rating || 0} />
    </div>
  )
}

interface StarRatingProps {
  rating: number
}

/**
 * Komponen StarRating
 *
 * Menampilkan rating dalam bentuk bintang
 */
function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center gap-1">
      {/* Bintang penuh */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}

      {/* Bintang setengah */}
      {hasHalfStar && (
        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path
            d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"
            fillOpacity="0.5"
          />
        </svg>
      )}
    </div>
  )
}

