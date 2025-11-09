'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { coachesApi } from '@/lib/api-client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

type UserOption = 'new' | 'existing' | 'none';

export default function NewCoachPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [userOption, setUserOption] = useState<UserOption>('new');

  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    documentNumber: '',
    birthDate: '',
    specialization: 'General',
    certificationLevel: 'Nivel 1',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '',
    certifications: '',
    biography: '',
  });

  const createCoachMutation = useMutation({
    mutationFn: (data: any) => coachesApi.create(data),
    onSuccess: () => {
      router.push('/dashboard/coaches');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage.join(', '));
      } else {
        setError(errorMessage || 'Error al crear entrenador');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let dataToSend: any = {
      birthDate: formData.birthDate,
      specialization: formData.specialization,
      certificationLevel: formData.certificationLevel,
      hireDate: formData.hireDate,
      salary: parseFloat(formData.salary),
      certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c),
      biography: formData.biography || null,
    };

    if (userOption === 'new') {
      // Crear entrenador con nuevo usuario
      dataToSend = {
        ...dataToSend,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        documentNumber: formData.documentNumber,
      };
    } else if (userOption === 'existing') {
      // Crear entrenador con usuario existente
      dataToSend.userId = parseInt(formData.userId);
    }
    // Si userOption === 'none', no se agrega userId ni datos de usuario

    createCoachMutation.mutate(dataToSend);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/coaches">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Entrenador</h1>
          <p className="text-muted-foreground">Registra un nuevo entrenador en el sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Entrenador</CardTitle>
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
              <h3 className="text-lg font-semibold mb-4">Tipo de Registro</h3>
              <div className="flex items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    checked={userOption === 'new'}
                    onChange={() => setUserOption('new')}
                    className="w-4 h-4"
                  />
                  <span>Crear nuevo usuario</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    checked={userOption === 'existing'}
                    onChange={() => setUserOption('existing')}
                    className="w-4 h-4"
                  />
                  <span>Usuario existente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    checked={userOption === 'none'}
                    onChange={() => setUserOption('none')}
                    className="w-4 h-4"
                  />
                  <span>Sin usuario</span>
                </label>
              </div>
            </div>

            {userOption === 'existing' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Seleccionar Usuario</h3>
                <div className="space-y-2">
                  <Label htmlFor="userId">ID del Usuario *</Label>
                  <Input
                    id="userId"
                    name="userId"
                    type="number"
                    value={formData.userId}
                    onChange={handleChange}
                    required={userOption === 'existing'}
                    placeholder="Ingrese el ID del usuario existente"
                  />
                  <p className="text-sm text-muted-foreground">
                    Ingrese el ID del usuario que ya existe en el sistema
                  </p>
                </div>
              </div>
            )}

            {userOption === 'new' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required={userOption === 'new'} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required={userOption === 'new'} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required={userOption === 'new'} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required={userOption === 'new'} minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required={userOption === 'new'} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Documento *</Label>
                    <Input id="documentNumber" name="documentNumber" value={formData.documentNumber} onChange={handleChange} required={userOption === 'new'} />
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Información Profesional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
                  <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Especialización *</Label>
                  <Select id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} required>
                    <option value="Defensa">Defensa</option>
                    <option value="Ataque">Ataque</option>
                    <option value="Portero">Portero</option>
                    <option value="General">General</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificationLevel">Nivel de Certificación *</Label>
                  <Select id="certificationLevel" name="certificationLevel" value={formData.certificationLevel} onChange={handleChange} required>
                    <option value="Nivel 1">Nivel 1</option>
                    <option value="Nivel 2">Nivel 2</option>
                    <option value="Nivel 3">Nivel 3</option>
                    <option value="Internacional">Internacional</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Fecha de Contratación *</Label>
                  <Input id="hireDate" name="hireDate" type="date" value={formData.hireDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salario (COP) *</Label>
                  <Input id="salary" name="salary" type="number" min="0" step="1000" value={formData.salary} onChange={handleChange} required placeholder="3000000" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certificaciones</Label>
                  <Input id="certifications" name="certifications" value={formData.certifications} onChange={handleChange} placeholder="Separadas por comas: UEFA A, IHF Level 2, etc." />
                  <p className="text-xs text-muted-foreground">Ingresa las certificaciones separadas por comas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biography">Biografía</Label>
                  <Textarea id="biography" name="biography" value={formData.biography} onChange={handleChange} placeholder="Experiencia, logros, trayectoria..." rows={4} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={createCoachMutation.isPending}>
                {createCoachMutation.isPending ? 'Guardando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Entrenador
                  </>
                )}
              </Button>
              <Link href="/dashboard/coaches">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
