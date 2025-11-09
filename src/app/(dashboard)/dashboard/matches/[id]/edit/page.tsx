export default function EditMatchPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Partido</h1>
        <p className="text-muted-foreground">Modifica la información del partido {params.id}</p>
      </div>
      {/* TODO: Implementar formulario de edición */}
    </div>
  );
}

