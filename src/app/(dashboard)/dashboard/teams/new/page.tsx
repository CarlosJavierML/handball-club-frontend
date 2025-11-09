'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { teamsApi, coachesApi } from '@/lib/api-client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewTeamPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Masculino',
    division: 'Primera',
    foundedYear: new Date().getFullYear(),
    headCoachId: '',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  });

  const { data: coaches } = useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const response = await coachesApi.getAll();
      return response.data;
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: (data: any) => teamsApi.create(data),
    onSuccess: () => {
      router.push('/dashboard/teams');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Error al crear equipo');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const dataToSend = {
      ...formData,
      foundedYear: parseInt(formData.foundedYear.toString()),
      headCoachId: formData.headCoachId || null,
    };

    createTeamMutation.mutate(dataToSend);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/teams">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Equipo</h1>
          <p className="text-muted-foreground">Registra un nuevo equipo en el sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Equipo</CardTitle>
          <CardDescription>Completa todos los campos requeridos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Equipo *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Leones de Bogotá" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select id="category" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Juvenil">Juvenil</option>
                    <option value="Cadete">Cadete</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">División *</Label>
                  <Select id="division" name="division" value={formData.division} onChange={handleChange} required>
                    <option value="Primera">Primera División</option>
                    <option value="Segunda">Segunda División</option>
                    <option value="Tercera">Tercera División</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Año de Fundación *</Label>
                  <Input id="foundedYear" name="foundedYear" type="number" min="1900" max={new Date().getFullYear()} value={formData.foundedYear} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Cuerpo Técnico</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headCoachId">Entrenador Principal</Label>
                  <Select id="headCoachId" name="headCoachId" value={formData.headCoachId} onChange={handleChange}>
                    <option value="">Selecciona un entrenador</option>
                    {coaches?.map((coach: any) => (
                      <option key={coach.id} value={coach.id}>
                        {coach.firstName} {coach.lastName} - {coach.specialization}
                      </option>
                    ))}
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Puedes asignar un entrenador ahora o más tarde
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Colores del Equipo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Color Primario</Label>
                  <div className="flex gap-2">
                    <Input id="primaryColor" name="primaryColor" type="color" value={formData.primaryColor} onChange={handleChange} className="w-20 h-10" />
                    <Input value={formData.primaryColor} onChange={(e) => setFormData({...formData, primaryColor: e.target.value})} placeholder="#000000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Color Secundario</Label>
                  <div className="flex gap-2">
                    <Input id="secondaryColor" name="secondaryColor" type="color" value={formData.secondaryColor} onChange={handleChange} className="w-20 h-10" />
                    <Input value={formData.secondaryColor} onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})} placeholder="#FFFFFF" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={createTeamMutation.isPending}>
                {createTeamMutation.isPending ? 'Guardando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Equipo
                  </>
                )}
              </Button>
              <Link href="/dashboard/teams">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

