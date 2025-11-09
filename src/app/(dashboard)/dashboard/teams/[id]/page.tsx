export default function TeamDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Detalle del Equipo</h1>
        <p className="text-muted-foreground">Información del equipo {params.id}</p>
      </div>
      {/* TODO: Implementar vista de detalle */}
    </div>
  );
}

