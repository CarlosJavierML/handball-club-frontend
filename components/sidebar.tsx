"use client"

import { useState } from "react"
import { Users, Calendar, Trophy, BarChart3, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: BarChart3, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Jugadores", id: "players" },
  { icon: Trophy, label: "Equipos", id: "teams" },
  { icon: Calendar, label: "Calendario", id: "schedule" },
  { icon: Trophy, label: "Torneos", id: "tournaments" },
]

export function Sidebar() {
  const [active, setActive] = useState("dashboard")

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col p-4">
      <div className="mb-8 px-2">
        <div className="w-12 h-12 bg-sidebar-primary rounded-lg flex items-center justify-center mb-3">
          <Trophy className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        <h2 className="text-lg font-bold text-sidebar-foreground">AdminClub</h2>
        <p className="text-xs text-sidebar-accent-foreground">v1.0</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              active === item.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="space-y-2 pt-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Settings className="w-5 h-5" />
          Configuración
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive">
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}
