function Profile() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Perfil del Emprendimiento</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Nombre del Emprendimiento</h2>
        <p className="mb-4">Descripción del emprendimiento...</p>
        <h3 className="text-xl font-semibold mb-2">Progreso</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Fase 1 completada</li>
          <li>Fase 2 en progreso</li>
          <li>Actualización: Completado taller de validación</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">Actualizaciones Recientes</h3>
        <div className="space-y-2">
          <div className="border-l-4 border-blue-500 pl-4">
            <p>Fecha: 2026-04-01</p>
            <p>Avance en el desarrollo del prototipo.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile