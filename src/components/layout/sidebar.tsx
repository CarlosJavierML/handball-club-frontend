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
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">🤾 Club Balonmano</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        {!loading && user && (
          <>
            <div className="mb-4 rounded-lg bg-accent p-3">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-xs">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {user.role.toUpperCase()}
                </span>
              </p>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}