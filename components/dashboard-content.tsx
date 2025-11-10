"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "./stat-card"
import { TeamCard } from "./team-card"
import { MatchCard } from "./match-card"
import { Users, Trophy, Calendar, Target } from "lucide-react"

export function DashboardContent() {
  return (
    <main className="flex-1 p-6 overflow-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Jugadores Totales" value="48" color="bg-blue-500" />
        <StatCard icon={Trophy} label="Equipos Activos" value="4" color="bg-green-500" />
        <StatCard icon={Calendar} label="Partidos Este Mes" value="12" color="bg-purple-500" />
        <StatCard icon={Target} label="Victorias" value="9" color="bg-orange-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximos Partidos */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Próximos Partidos</h2>
            <Button variant="outline" size="sm">
              Ver Todo
            </Button>
          </div>
          <div className="space-y-3">
            <MatchCard team1="Senior A" team2="Equipo Rival" date="Hoy, 19:00" venue="Pabellón Principal" />
            <MatchCard team1="Senior B" team2="Equipo Rival B" date="Mañana, 20:00" venue="Pabellón Secundario" />
            <MatchCard team1="Juvenil" team2="Equipo Rival C" date="Viernes, 18:00" venue="Pabellón Principal" />
          </div>
        </div>

        {/* Equipos Destacados */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Equipos</h2>
            <Button variant="outline" size="sm">
              + Nuevo
            </Button>
          </div>
          <div className="space-y-3">
            <TeamCard name="Senior A" players="14" wins="9" losses="2" />
            <TeamCard name="Senior B" players="12" wins="6" losses="4" />
            <TeamCard name="Juvenil" players="16" wins="7" losses="3" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Actividad Reciente</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">Nuevo jugador registrado</p>
                  <p className="text-sm text-muted-foreground">Juan García agregado a Senior A</p>
                </div>
                <p className="text-xs text-muted-foreground">Hace {i} minutos</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
