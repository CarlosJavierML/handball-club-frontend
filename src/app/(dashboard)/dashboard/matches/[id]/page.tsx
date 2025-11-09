export default function MatchDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Detalle del Partido</h1>
        <p className="text-muted-foreground">Información del partido {params.id}</p>
      </div>
      {/* TODO: Implementar vista de detalle */}
    </div>
  );
}

