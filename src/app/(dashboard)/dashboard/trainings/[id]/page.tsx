export default function TrainingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Detalle del Entrenamiento</h1>
        <p className="text-muted-foreground">Información del entrenamiento {params.id}</p>
      </div>
      {/* TODO: Implementar vista de detalle */}
    </div>
  );
}

