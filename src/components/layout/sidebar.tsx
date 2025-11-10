"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Shield,
  Trophy,
  DollarSign,
  PartyPopper,
  Dumbbell,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "coach", "player"] },
  { name: "Jugadores", href: "/dashboard/players", icon: Users, roles: ["admin", "manager", "coach"] },
  { name: "Entrenadores", href: "/dashboard/coaches", icon: UserCog, roles: ["admin", "manager"] },
  { name: "Equipos", href: "/dashboard/teams", icon: Shield, roles: ["admin", "manager", "coach"] },
  { name: "Partidos", href: "/dashboard/matches", icon: Trophy, roles: ["admin", "manager", "coach"] },
  { name: "Entrenamientos", href: "/dashboard/trainings", icon: Dumbbell, roles: ["admin", "manager", "coach"] },
  { name: "Pagos", href: "/dashboard/payments", icon: DollarSign, roles: ["admin", "manager"] },
  { name: "Eventos", href: "/dashboard/events", icon: PartyPopper, roles: ["admin", "manager", "coach"] },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <div
      className={`flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-4">
        {!collapsed && (
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🏐 Club Balonmano
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 text-slate-300" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white",
              )}
              title={collapsed ? item.name : ""}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-700/50 p-4">
        {!loading && user && (
          <>
            <div className="mb-4 rounded-lg bg-slate-700/50 p-3 border border-slate-600/50">
              {!collapsed && (
                <>
                  <p className="text-sm font-semibold text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <p className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-blue-600/20 px-2.5 py-1 text-xs font-semibold text-blue-300 border border-blue-600/30">
                      {user.role.toUpperCase()}
                    </span>
                  </p>
                </>
              )}
            </div>
            <button
              onClick={logout}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "text-slate-300 hover:bg-red-600/20 hover:text-red-300",
              )}
              title={collapsed ? "Cerrar Sesión" : ""}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
