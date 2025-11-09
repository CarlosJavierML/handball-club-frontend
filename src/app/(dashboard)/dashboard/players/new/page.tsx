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
import { playersApi } from '@/lib/api-client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

type UserOption = 'new' | 'existing' | 'none';

export default function NewPlayerPage() {
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
    position: 'center_back',
    jerseyNumber: '',
    category: '',
    height: '',
    weight: '',
    dominantHand: 'right',
    medicalInfo: '',
    emergencyContact: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const createPlayerMutation = useMutation({
    mutationFn: (data: any) => playersApi.create(data),
    onSuccess: () => {
      router.push('/dashboard/players');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage.join(', '));
      } else {
        setError(errorMessage || 'Error al crear jugador');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let dataToSend: any = {
      birthDate: formData.birthDate,
      position: formData.position,
      jerseyNumber: formData.jerseyNumber || null,
      category: formData.category,
      medicalInfo: formData.medicalInfo || null,
      emergencyContact: formData.emergencyContact,
      joinDate: formData.joinDate,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
    };

    if (userOption === 'new') {
      // Crear jugador con nuevo usuario
      dataToSend = {
        ...dataToSend,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        documentNumber: formData.documentNumber,
        dominantHand: formData.dominantHand,
      };
    } else if (userOption === 'existing') {
      // Crear jugador con usuario existente
      dataToSend.userId = parseInt(formData.userId);
    }
    // Si userOption === 'none', no se agrega userId ni datos de usuario

    createPlayerMutation.mutate(dataToSend);
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
        <Link href="/dashboard/players">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Jugador</h1>
          <p className="text-muted-foreground">Registra un nuevo jugador en el sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Jugador</CardTitle>
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
              <h3 className="text-lg font-semibold mb-4">Información Deportiva</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
                  <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Posición *</Label>
                  <Select id="position" name="position" value={formData.position} onChange={handleChange} required>
                    <option value="goalkeeper">Portero</option>
                    <option value="left_wing">Extremo Izquierdo</option>
                    <option value="left_back">Lateral Izquierdo</option>
                    <option value="center_back">Central</option>
                    <option value="right_back">Lateral Derecho</option>
                    <option value="right_wing">Extremo Derecho</option>
                    <option value="pivot">Pivot</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jerseyNumber">Número de Camiseta</Label>
                  <Input id="jerseyNumber" name="jerseyNumber" type="number" min="1" max="99" value={formData.jerseyNumber} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select id="category" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Selecciona una categoría</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Cadete">Cadete</option>
                    <option value="Juvenil">Juvenil</option>
                    <option value="Senior">Senior</option>
                    <option value="Veterano">Veterano</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dominantHand">Mano Dominante</Label>
                  <Select id="dominantHand" name="dominantHand" value={formData.dominantHand} onChange={handleChange}>
                    <option value="right">Derecha</option>
                    <option value="left">Izquierda</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input id="height" name="height" type="number" min="100" max="250" value={formData.height} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" name="weight" type="number" min="30" max="150" value={formData.weight} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Fecha de Ingreso *</Label>
                  <Input id="joinDate" name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Información Médica y de Emergencia</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalInfo">Información Médica</Label>
                  <Textarea id="medicalInfo" name="medicalInfo" placeholder="Alergias, condiciones médicas, medicamentos..." rows={3} value={formData.medicalInfo} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Contacto de Emergencia *</Label>
                  <Textarea id="emergencyContact" name="emergencyContact" placeholder="Nombre, relación y teléfono del contacto de emergencia" rows={2} value={formData.emergencyContact} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={createPlayerMutation.isPending}>
                {createPlayerMutation.isPending ? 'Guardando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Jugador
                  </>
                )}
              </Button>
              <Link href="/dashboard/players">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

