'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trainingsApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { format, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TrainingsPage() {
  const { data: trainings, isLoading } = useQuery({
    queryKey: ['trainings'],
    queryFn: async () => {
      const response = await trainingsApi.getAll();
      return response.data;
    },
  });

  const getTypeColor = (type: string) => {
    const colors: any = {
      'Técnico': 'bg-blue-500',
      'Táctico': 'bg-purple-500',
      'Físico': 'bg-red-500',
      'Recuperación': 'bg-green-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'scheduled': 'bg-blue-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Entrenamientos</h1>
          <p className="text-muted-foreground">Programa y gestiona los entrenamientos</p>
        </div>
        <Link href="/dashboard/trainings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Entrenamiento
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Cargando...</div>
      ) : trainings?.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No hay entrenamientos programados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainings?.map((training: any) => {
            const duration = differenceInMinutes(
              new Date(training.endTime),
              new Date(training.startTime)
            );
            
            return (
              <Card key={training.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{training.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(training.trainingType)}>
                          {training.trainingType}
                        </Badge>
                        <Badge className={getStatusColor(training.status)}>
                          {training.status === 'scheduled' ? 'Programado' :
                           training.status === 'completed' ? 'Completado' : 'Cancelado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(training.startTime), "dd MMM yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(training.startTime), "HH:mm")} - 
                        {format(new Date(training.endTime), "HH:mm")} ({duration} min)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{training.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{training.attendees?.length || 0} asistentes</span>
                    </div>
                  </div>

                  {training.team && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Equipo</p>
                      <p className="font-medium">{training.team.name}</p>
                    </div>
                  )}

                  {training.coach && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Entrenador</p>
                      <p className="font-medium">
                        {training.coach.firstName} {training.coach.lastName}
                      </p>
                    </div>
                  )}

                  <Link href={`/dashboard/trainings/${training.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}