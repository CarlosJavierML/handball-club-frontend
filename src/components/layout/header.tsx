"use client"

import { useAuth } from '@/providers/auth-provider';
import { Bell, Search, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname?.startsWith('/dashboard/players')) return 'Jugadores';
    if (pathname?.startsWith('/dashboard/coaches')) return 'Entrenadores';
    if (pathname?.startsWith('/dashboard/teams')) return 'Equipos';
    if (pathname?.startsWith('/dashboard/matches')) return 'Partidos';
    if (pathname?.startsWith('/dashboard/trainings')) return 'Entrenamientos';
    if (pathname?.startsWith('/dashboard/payments')) return 'Pagos';
    if (pathname?.startsWith('/dashboard/events')) return 'Eventos';
    if (pathname?.startsWith('/dashboard/settings')) return 'Configuración';
    return 'Club Balonmano';
  };

  return (
    <header className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 shadow-sm">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            {getPageTitle()}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.role}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
