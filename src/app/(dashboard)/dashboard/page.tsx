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
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { playersApi, coachesApi, teamsApi, matchesApi, paymentsApi } from '@/lib/api-client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // Queries para datos del dashboard
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
    { label: 'Nuevo Jugador', href: '/dashboard/players/new', icon: Users, roles: ['admin', 'manager'] },
    { label: 'Nuevo Entrenador', href: '/dashboard/coaches/new', icon: UserCog, roles: ['admin', 'manager'] },
    { label: 'Nuevo Equipo', href: '/dashboard/teams/new', icon: Shield, roles: ['admin', 'manager'] },
    { label: 'Nuevo Partido', href: '/dashboard/matches/new', icon: Trophy, roles: ['admin', 'manager'] },
    { label: 'Registrar Pago', href: '/dashboard/payments/new', icon: DollarSign, roles: ['admin', 'manager'] },
    { label: 'Nuevo Evento', href: '/dashboard/events/new', icon: Calendar, roles: ['admin', 'manager'] },
  ];

  const filteredActions = quickActions.filter(action =>
    action.roles.includes(user?.role || '')
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido de nuevo, {user?.firstName} 👋
        </p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entrenadores</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coaches?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Staff técnico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Equipos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Equipos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(paymentStats?.totalPaidAmount || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {paymentStats?.paid || 0} pagos este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      {filteredActions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                    <action.icon className="h-8 w-8 text-primary" />
                    <p className="text-sm font-medium text-center">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Partidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos Partidos</CardTitle>
            <Link href="/dashboard/matches">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingMatches?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay partidos próximos
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMatches?.slice(0, 3).map((match: any) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{match.competition}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(match.matchDate), "dd MMM • HH:mm", { locale: es })}
                        </span>
                      </div>
                      <p className="font-medium text-sm">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{match.venue}</p>
                    </div>
                    <Link href={`/dashboard/matches/${match.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estado de Pagos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Estado de Pagos</CardTitle>
            <Link href="/dashboard/payments">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Pagados</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {paymentStats?.paid || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold">
                    {formatCurrency(paymentStats?.totalPaidAmount || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                    <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {paymentStats?.pending || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Por cobrar</p>
                  <p className="font-semibold">
                    {formatCurrency(paymentStats?.totalPendingAmount || 0)}
                  </p>
                </div>
              </div>

              {paymentStats?.overdue > 0 && (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                      <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Vencidos</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {paymentStats?.overdue || 0}
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/payments?tab=overdue">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nuevos jugadores registrados</p>
                <p className="text-xs text-muted-foreground">
                  {players?.slice(0, 3).map((p: any) => `${p.firstName} ${p.lastName}`).join(', ')}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Hoy</span>
            </div>

            {upcomingMatches?.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Próximo partido programado</p>
                  <p className="text-xs text-muted-foreground">
                    {upcomingMatches[0]?.homeTeam.name} vs {upcomingMatches[0]?.awayTeam.name}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(upcomingMatches[0]?.matchDate), "dd MMM", { locale: es })}
                </span>
              </div>
            )}

            {teams?.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Equipos activos</p>
                  <p className="text-xs text-muted-foreground">
                    {teams.length} equipos compitiendo en diferentes categorías
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Activo</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}