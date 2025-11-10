import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock } from "lucide-react"

interface MatchCardProps {
  team1: string
  team2: string
  date: string
  venue: string
}

export function MatchCard({ team1, team2, date, venue }: MatchCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-foreground">{team1}</span>
            <span className="text-xs px-2 py-1 bg-muted rounded">VS</span>
            <span className="font-semibold text-foreground">{team2}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {date}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {venue}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Ver Detalles
        </Button>
      </div>
    </Card>
  )
}
