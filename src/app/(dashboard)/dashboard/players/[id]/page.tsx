'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { playersApi } from '@/lib/api-client';
import { Player } from '@/types';
import { ArrowLeft, Edit, Mail, Phone, Calendar, User, Heart, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { use } from 'react';

export default function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: player, isLoading, error } = useQuery({
    queryKey: ['players', id],
    queryFn: async () => {
      const response = await playersApi.getOne(id);
      return response.data as Player;
    },
  });

  const { data: statistics } = useQuery({
    queryKey: ['players', id, 'statistics'],
    queryFn: async () => {
      const response = await playersApi.getStatistics(id);
      return response.data;
    },
  });

  const getPositionLabel = (position: string) => {
    const positions: Record<string, string> = {
      GOALKEEPER: 'Portero',
      LEFT_WING: 'Extremo Izquierdo',
      LEFT_BACK: 'Lateral Izquierdo',
      CENTER_BACK: 'Central',
      RIGHT_BACK: 'Lateral Derecho',
      RIGHT_WING: 'Extremo Derecho',
      PIVOT: 'Pivot',
    };
    return positions[position] || position;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando información del jugador...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-200">
          Error al cargar jugador
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/players">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{player.firstName} {player.lastName}</h1>
            <p className="text-muted-foreground">{getPositionLabel(player.position)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={player.isActive ? 'default' : 'outline'}>
            {player.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
          <Link href={`/dashboard/players/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="medical">Médico</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre Completo</p>
                  <p className="font-medium">{player.firstName} {player.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-medium">{player.documentNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{player.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{player.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                    <p className="font-medium">
                      {format(new Date(player.birthDate), 'dd MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información Deportiva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Posición</p>
                  <p className="font-medium">{getPositionLabel(player.position)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número de Camiseta</p>
                  <p className="font-medium text-2xl">{player.jerseyNumber || 'Sin asignar'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mano Dominante</p>
                  <p className="font-medium capitalize">{player.dominantHand === 'left' ? 'Izquierda' : 'Derecha'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Altura</p>
                    <p className="font-medium">{player.height ? `${player.height} cm` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Peso</p>
                    <p className="font-medium">{player.weight ? `${player.weight} kg` : '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {player.team && (
            <Card>
              <CardHeader>
                <CardTitle>Equipo Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/teams/${player.team.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div>
                      <p className="font-medium">{player.team.name}</p>
                      <p className="text-sm text-muted-foreground">{player.team.category} - {player.team.division}</p>
                    </div>
                    <Button variant="ghost" size="sm">Ver Equipo</Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Goles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics?.totalGoals || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Asistencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics?.totalAssists || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Partidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics?.matchesPlayed || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Minutos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics?.totalMinutes || 0}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Información Médica
              </CardTitle>
            </CardHeader>
            <CardContent>
              {player.medicalInfo ? (
                <p className="text-sm whitespace-pre-wrap">{player.medicalInfo}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Sin información médica registrada</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Contacto de Emergencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              {player.emergencyContact ? (
                <p className="text-sm whitespace-pre-wrap">{player.emergencyContact}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Sin contacto de emergencia registrado</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

