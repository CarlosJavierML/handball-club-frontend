'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { playersApi } from '@/lib/api-client';
import { Player } from '@/types';
import { Users, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PlayersPage() {
  const { data: players, isLoading, error } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const response = await playersApi.getAll();
      return response.data as Player[];
    },
  });

  const getPositionLabel = (position: string) => {
    const positions: Record<string, string> = {
      GOALKEEPER: 'Portero',
      LEFT_WING: 'Extremo Izq',
      LEFT_BACK: 'Lateral Izq',
      CENTER_BACK: 'Central',
      RIGHT_BACK: 'Lateral Der',
      RIGHT_WING: 'Extremo Der',
      PIVOT: 'Pivot',
    };
    return positions[position] || position;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando jugadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-200">
          Error al cargar jugadores: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jugadores</h1>
          <p className="text-muted-foreground">Gestiona los jugadores del club</p>
        </div>
        <Link href="/dashboard/players/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Jugador
          </Button>
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jugadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {players?.filter((p) => p.isActive).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Jugadores activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {players?.filter((p) => !p.isActive).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Jugadores inactivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de jugadores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Jugadores</CardTitle>
        </CardHeader>
        <CardContent>
          {!players || players.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay jugadores</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Comienza agregando un nuevo jugador
              </p>
              <Link href="/dashboard/players/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Jugador
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Ingreso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {player.firstName} {player.lastName}
                    </TableCell>
                    <TableCell>{player.email}</TableCell>
                    <TableCell>{getPositionLabel(player.position)}</TableCell>
                    <TableCell>
                      {player.jerseyNumber || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={player.isActive ? 'default' : 'outline'}>
                        {player.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(player.createdAt), 'dd MMM yyyy', { locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/players/${player.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/players/${player.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
