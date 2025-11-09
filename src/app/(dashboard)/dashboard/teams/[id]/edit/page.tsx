export default function EditTeamPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Equipo</h1>
        <p className="text-muted-foreground">Modifica la información del equipo {params.id}</p>
      </div>
      {/* TODO: Implementar formulario de edición */}
    </div>
  );
}

