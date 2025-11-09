'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Shield,
  Trophy,
  Calendar,
  DollarSign,
  PartyPopper,
  Dumbbell,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'coach', 'player'] },
  { name: 'Jugadores', href: '/dashboard/players', icon: Users, roles: ['admin', 'manager', 'coach'] },
  { name: 'Entrenadores', href: '/dashboard/coaches', icon: UserCog, roles: ['admin', 'manager'] },
  { name: 'Equipos', href: '/dashboard/teams', icon: Shield, roles: ['admin', 'manager', 'coach'] },
  { name: 'Partidos', href: '/dashboard/matches', icon: Trophy, roles: ['admin', 'manager', 'coach'] },
  { name: 'Entrenamientos', href: '/dashboard/trainings', icon: Dumbbell, roles: ['admin', 'manager', 'coach'] },
  { name: 'Pagos', href: '/dashboard/payments', icon: DollarSign, roles: ['admin', 'manager'] },
  { name: 'Eventos', href: '/dashboard/events', icon: PartyPopper, roles: ['admin', 'manager', 'coach'] },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl">
      <div className="flex h-20 items-center justify-center border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-2xl">🤾</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Club Balonmano</h1>
            <p className="text-xs text-slate-400">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              )}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                isActive && "opacity-0"
              )} />
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-200 group-hover:scale-110 relative z-10",
                isActive && "drop-shadow-sm"
              )} />
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 ml-auto relative z-10" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700/50 p-4 bg-slate-900/30">
        {!loading && user && (
          <>
            <div className="mb-3 rounded-lg bg-slate-800/50 backdrop-blur-sm p-3 border border-slate-700/50">
              <p className="text-sm font-semibold text-white">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-500/30 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Cerrar Sesión</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}