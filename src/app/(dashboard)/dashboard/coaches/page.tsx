'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coachesApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CoachesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: coaches, isLoading } = useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const response = await coachesApi.getAll();
      return response.data;
    },
  });

  const filteredCoaches = coaches?.filter((coach: any) =>
    `${coach.firstName} ${coach.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSpecializationColor = (spec: string) => {
    const colors: any = {
      'Defensa': 'bg-blue-500',
      'Ataque': 'bg-red-500',
      'Portero': 'bg-green-500',
      'General': 'bg-purple-500',
    };
    return colors[spec] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Entrenadores</h1>
          <p className="text-muted-foreground">
            Gestiona los entrenadores del club
          </p>
        </div>
        <Link href="/dashboard/coaches/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Entrenador
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar entrenadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Especialización</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Fecha Contratación</TableHead>
              <TableHead>Equipos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filteredCoaches?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No se encontraron entrenadores
                </TableCell>
              </TableRow>
            ) : (
              filteredCoaches?.map((coach: any) => (
                <TableRow key={coach.id}>
                  <TableCell className="font-medium">
                    {coach.firstName} {coach.lastName}
                  </TableCell>
                  <TableCell>
                    <Badge className={getSpecializationColor(coach.specialization)}>
                      {coach.specialization}
                    </Badge>
                  </TableCell>
                  <TableCell>{coach.certificationLevel}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {coach.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {coach.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(coach.hireDate), 'dd MMM yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coach.teamsAsHead?.length || 0} equipo(s)
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/coaches/${coach.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/coaches/${coach.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}