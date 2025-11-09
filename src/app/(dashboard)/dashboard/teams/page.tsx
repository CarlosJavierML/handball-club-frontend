'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { teamsApi } from '@/lib/api-client';
import { Team } from '@/types';
import { Shield, Plus, Users, Eye, Edit } from 'lucide-react';

export default function TeamsPage() {
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsApi.getAll();
      return response.data as Team[];
    },
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Masculino': 'bg-blue-500',
      'Femenino': 'bg-pink-500',
      'Juvenil': 'bg-green-500',
      'Cadete': 'bg-yellow-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-200">
          Error al cargar equipos: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipos</h1>
          <p className="text-muted-foreground">Gestiona los equipos del club</p>
        </div>
        <Link href="/dashboard/teams/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Equipo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Equipos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Equipos Activos</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams?.filter((t) => t.isActive).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">En competición</p>
          </CardContent>
        </Card>
      </div>

      {!teams || teams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No hay equipos</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Comienza creando un nuevo equipo
            </p>
            <Link href="/dashboard/teams/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Crear Equipo
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {team.name}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getCategoryColor(team.category)}>
                        {team.category}
                      </Badge>
                      <Badge variant="outline">{team.division}</Badge>
                    </div>
                  </div>
                  <Badge variant={team.isActive ? 'default' : 'outline'}>
                    {team.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {team.headCoach && (
                    <div>
                      <p className="text-sm text-muted-foreground">Entrenador Principal</p>
                      <p className="font-medium">
                        {team.headCoach.firstName} {team.headCoach.lastName}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {team.players?.length || 0} jugador(es)
                    </span>
                  </div>

                  {team.foundedYear && (
                    <p className="text-sm text-muted-foreground">
                      Fundado: {team.foundedYear}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Link href={`/dashboard/teams/${team.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalle
                      </Button>
                    </Link>
                    <Link href={`/dashboard/teams/${team.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

