'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api-client';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await paymentsApi.getAll();
      return response.data;
    },
  });

  const { data: statistics } = useQuery({
    queryKey: ['payments', 'statistics'],
    queryFn: async () => {
      const response = await paymentsApi.getStatistics();
      return response.data;
    },
  });

  const { data: overduePayments } = useQuery({
    queryKey: ['payments', 'overdue'],
    queryFn: async () => {
      const response = await paymentsApi.getOverdue();
      return response.data;
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.markAsPaid(id),
    onSuccess: () => {
      toast.success('Pago marcado como pagado');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: () => {
      toast.error('Error al actualizar el pago');
    },
  });

  const filteredPayments = payments?.filter((payment: any) =>
    `${payment.player?.firstName} ${payment.player?.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    payment.concept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: any = {
      'pending': 'bg-yellow-500',
      'paid': 'bg-green-500',
      'overdue': 'bg-red-500',
      'cancelled': 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      'pending': 'Pendiente',
      'paid': 'Pagado',
      'overdue': 'Vencido',
      'cancelled': 'Cancelado',
    };
    return texts[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pagos y Finanzas</h1>
          <p className="text-muted-foreground">Gestiona los pagos y membresías del club</p>
        </div>
        <Link href="/dashboard/payments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Pago
          </Button>
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(statistics?.totalPaidAmount || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics?.paid || 0} pagos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(statistics?.totalPendingAmount || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics?.pending || 0} pagos pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {statistics?.overdue || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pagos atrasados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pagos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registros totales
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="overdue">
            Vencidos
            {overduePayments?.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {overduePayments.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar pagos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <TabsContent value="all">
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jugador</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha Pago</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
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
                ) : filteredPayments?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No se encontraron pagos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments?.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.player?.firstName} {payment.player?.lastName}
                      </TableCell>
                      <TableCell>{payment.concept}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        {payment.status === 'paid'
                          ? format(new Date(payment.paymentDate), 'dd/MM/yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payment.dueDate), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusText(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsPaidMutation.mutate(payment.id)}
                            disabled={markAsPaidMutation.isPending}
                          >
                            Marcar Pagado
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="overdue">
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jugador</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Días Vencidos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overduePayments?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No hay pagos vencidos
                    </TableCell>
                  </TableRow>
                ) : (
                  overduePayments?.map((payment: any) => {
                    const daysOverdue = Math.floor(
                      (new Date().getTime() - new Date(payment.dueDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.player?.firstName} {payment.player?.lastName}
                        </TableCell>
                        <TableCell>{payment.concept}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(payment.dueDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{daysOverdue} días</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsPaidMutation.mutate(payment.id)}
                            disabled={markAsPaidMutation.isPending}
                          >
                            Marcar Pagado
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}