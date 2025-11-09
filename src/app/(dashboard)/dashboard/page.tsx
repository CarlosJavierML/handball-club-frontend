'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCog,
  Shield,
  Calendar,
  TrendingUp,
  DollarSign,
  Trophy,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { playersApi, coachesApi, teamsApi, matchesApi, paymentsApi } from '@/lib/api-client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const { data: players } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const response = await playersApi.getAll();
      return response.data;
    },
  });

  const { data: coaches } = useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const response = await coachesApi.getAll();
      return response.data;
    },
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsApi.getAll();
      return response.data;
    },
  });

  const { data: upcomingMatches } = useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: async () => {
      const response = await matchesApi.getUpcoming();
      return response.data;
    },
  });

  const { data: paymentStats } = useQuery({
    queryKey: ['payments', 'statistics'],
    queryFn: async () => {
      const response = await paymentsApi.getStatistics();
      return response.data;
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickActions = [
    { label: 'Nuevo Jugador', href: '/dashboard/players/new', icon: Users, roles: ['admin', 'manager'], color: 'from-blue-500 to-cyan-500' },
    { label: 'Nuevo Entrenador', href: '/dashboard/coaches/new', icon: UserCog, roles: ['admin', 'manager'], color: 'from-green-500 to-emerald-500' },
    { label: 'Nuevo Equipo', href: '/dashboard/teams/new', icon: Shield, roles: ['admin', 'manager'], color: 'from-orange-500 to-red-500' },
    { label: 'Nuevo Partido', href: '/dashboard/matches/new', icon: Trophy, roles: ['admin', 'manager'], color: 'from-purple-500 to-pink-500' },
    { label: 'Registrar Pago', href: '/dashboard/payments/new', icon: DollarSign, roles: ['admin', 'manager'], color: 'from-yellow-500 to-orange-500' },
    { label: 'Nuevo Evento', href: '/dashboard/events/new', icon: Calendar, roles: ['admin', 'manager'], color: 'from-indigo-500 to-blue-500' },
  ];

  const filteredActions = quickActions.filter(action =>
    action.roles.includes(user?.role || '')
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Bienvenido de nuevo
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/20 rounded-lg">
          <Sparkles className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <TrendingUp className="h-5 w-5 opacity-75" />
            </div>
            <p className="text-sm font-medium opacity-90 mb-1">Total Jugadores</p>
            <p className="text-4xl font-bold">{players?.length || 0}</p>
            <p className="text-xs opacity-75 mt-2">Registrados en el club</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <UserCog className="h-6 w-6" />
              </div>
              <TrendingUp className="h-5 w-5 opacity-75" />
            </div>
            <p className="text-sm font-medium opacity-90 mb-1">Entrenadores</p>
            <p className="text-4xl font-bold">{coaches?.length || 0}</p>
            <p className="text-xs opacity-75 mt-2">Staff técnico activo</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield className="h-6 w-6" />
              </div>
              <TrendingUp className="h-5 w-5 opacity-75" />
            </div>
            <p className="text-sm font-medium opacity-90 mb-1">Equipos</p>
            <p className="text-4xl font-bold">{teams?.length || 0}</p>
            <p className="text-xs opacity-75 mt-2">Equipos en competición</p>
          </div>
        </div>
      </div>

      {filteredActions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative flex flex-col items-center justify-center space-y-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-center text-slate-700 dark:text-slate-300">{action.label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              Próximos Partidos
            </CardTitle>
            <Link href="/dashboard/matches">
              <Button variant="ghost" size="sm" className="group">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            {upcomingMatches?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">No hay partidos próximos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingMatches?.slice(0, 3).map((match: any) => (
                  <Link key={match.id} href={`/dashboard/matches/${match.id}`}>
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{match.competition}</Badge>
                          <span className="text-xs text-slate-500">
                            {format(new Date(match.matchDate), "dd MMM • HH:mm", { locale: es })}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white mb-1">
                          {match.homeTeam.name} vs {match.awayTeam.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{match.venue}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Estado de Pagos
            </CardTitle>
            <Link href="/dashboard/payments">
              <Button variant="ghost" size="sm" className="group">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-green-200 dark:border-green-900 rounded-lg bg-green-50 dark:bg-green-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Pagados</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {paymentStats?.paid || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">Total</p>
                  <p className="font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(paymentStats?.totalPaidAmount || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-yellow-200 dark:border-yellow-900 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {paymentStats?.pending || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Por cobrar</p>
                  <p className="font-bold text-yellow-900 dark:text-yellow-100">
                    {formatCurrency(paymentStats?.totalPendingAmount || 0)}
                  </p>
                </div>
              </div>

              {paymentStats?.overdue > 0 && (
                <Link href="/dashboard/payments?tab=overdue">
                  <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950/30 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">Vencidos</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {paymentStats?.overdue || 0}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-red-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {players && players.length > 0 && (
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Nuevos jugadores registrados</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {players?.slice(0, 3).map((p: any) => `${p.firstName} ${p.lastName}`).join(', ')}
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Hoy</span>
              </div>
            )}

            {upcomingMatches?.length > 0 && (
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Próximo partido programado</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {upcomingMatches[0]?.homeTeam.name} vs {upcomingMatches[0]?.awayTeam.name}
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {format(new Date(upcomingMatches[0]?.matchDate), "dd MMM", { locale: es })}
                </span>
              </div>
            )}

            {teams?.length > 0 && (
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Equipos activos</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {teams.length} equipos compitiendo en diferentes categorías
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Activo</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
