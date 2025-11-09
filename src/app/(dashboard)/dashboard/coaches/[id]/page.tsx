'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { coachesApi } from '@/lib/api-client';
import { Coach } from '@/types';
import { ArrowLeft, Edit, Mail, Phone, Calendar, Award, DollarSign, Users } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { use } from 'react';

export default function CoachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: coach, isLoading, error } = useQuery({
    queryKey: ['coaches', id],
    queryFn: async () => {
      const response = await coachesApi.getOne(id);
      return response.data as Coach;
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando información del entrenador...</p>
        </div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-200">
          Error al cargar entrenador
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/coaches">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{coach.firstName} {coach.lastName}</h1>
            <p className="text-muted-foreground">{coach.specialization} - {coach.certificationLevel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={coach.isActive ? 'default' : 'outline'}>
            {coach.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
          <Link href={`/dashboard/coaches/${id}/edit`}>
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
          <TabsTrigger value="teams">Equipos</TabsTrigger>
          <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre Completo</p>
                  <p className="font-medium">{coach.firstName} {coach.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-medium">{coach.documentNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{coach.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{coach.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                    <p className="font-medium">
                      {format(new Date(coach.birthDate), 'dd MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información Profesional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Especialización</p>
                    <p className="font-medium">{coach.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Nivel de Certificación</p>
                    <p className="font-medium">{coach.certificationLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Fecha de Contratación</p>
                    <p className="font-medium">
                      {format(new Date(coach.hireDate), 'dd MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Salario</p>
                    <p className="font-medium text-lg">{formatCurrency(coach.salary)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {coach.biography && (
            <Card>
              <CardHeader>
                <CardTitle>Biografía</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{coach.biography}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipos como Entrenador Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coach.teamsAsHead && coach.teamsAsHead.length > 0 ? (
                <div className="space-y-3">
                  {coach.teamsAsHead.map((team) => (
                    <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-sm text-muted-foreground">{team.category} - {team.division}</p>
                        </div>
                        <Button variant="ghost" size="sm">Ver Equipo</Button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No es entrenador principal de ningún equipo</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipos como Asistente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coach.teamsAsAssistant && coach.teamsAsAssistant.length > 0 ? (
                <div className="space-y-3">
                  {coach.teamsAsAssistant.map((team) => (
                    <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-sm text-muted-foreground">{team.category} - {team.division}</p>
                        </div>
                        <Button variant="ghost" size="sm">Ver Equipo</Button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No es asistente de ningún equipo</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coach.certifications && coach.certifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coach.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay certificaciones registradas</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

