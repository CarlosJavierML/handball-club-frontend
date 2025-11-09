'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchesApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, MapPin, Trophy } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MatchesPage() {
  const { data: allMatches, isLoading: loadingAll } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const response = await matchesApi.getAll();
      return response.data;
    },
  });

  const { data: upcomingMatches, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: async () => {
      const response = await matchesApi.getUpcoming();
      return response.data;
    },
  });

  const getStatusColor = (status: string) => {
    const colors: any = {
      'scheduled': 'bg-blue-500',
      'in_progress': 'bg-yellow-500',
      'finished': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'postponed': 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      'scheduled': 'Programado',
      'in_progress': 'En Curso',
      'finished': 'Finalizado',
      'cancelled': 'Cancelado',
      'postponed': 'Pospuesto',
    };
    return texts[status] || status;
  };

  const MatchCard = ({ match }: { match: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge className={getStatusColor(match.status)}>
              {getStatusText(match.status)}
            </Badge>
            <Badge variant="outline" className="ml-2">{match.competition}</Badge>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {format(new Date(match.matchDate), "dd MMM yyyy • HH:mm", { locale: es })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="font-bold text-lg">{match.homeTeam.name}</p>
            {match.status === 'finished' && (
              <p className="text-3xl font-bold text-primary mt-2">{match.homeScore}</p>
            )}
          </div>
          <div className="px-4">
            <p className="text-muted-foreground">VS</p>
          </div>
          <div className="flex-1 text-center">
            <p className="font-bold text-lg">{match.awayTeam.name}</p>
            {match.status === 'finished' && (
              <p className="text-3xl font-bold text-primary mt-2">{match.awayScore}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{match.venue}</span>
          </div>
          {match.round && (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>{match.round}</span>
            </div>
          )}
        </div>

        <Link href={`/dashboard/matches/${match.id}`}>
          <Button variant="outline" className="w-full">
            Ver Detalles
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partidos</h1>
          <p className="text-muted-foreground">Calendario y resultados de partidos</p>
        </div>
        <Link href="/dashboard/matches/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Partido
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loadingUpcoming ? (
            <div className="text-center py-8">Cargando...</div>
          ) : upcomingMatches?.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay partidos próximos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMatches?.map((match: any) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {loadingAll ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allMatches?.map((match: any) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}