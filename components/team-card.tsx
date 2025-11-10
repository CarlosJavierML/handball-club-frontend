import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TeamCardProps {
  name: string
  players: string
  wins: string
  losses: string
}

export function TeamCard({ name, players, wins, losses }: TeamCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <Button variant="ghost" size="sm">
          ⋯
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Jugadores</p>
          <p className="font-bold text-foreground">{players}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Victorias</p>
          <p className="font-bold text-green-600">{wins}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Derrotas</p>
          <p className="font-bold text-red-600">{losses}</p>
        </div>
      </div>
    </Card>
  )
}
