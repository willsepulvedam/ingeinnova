function Phases() {
  const phases = [
    { id: 1, name: 'Fase 1: Ideación', description: 'Desarrollar la idea inicial.' },
    { id: 2, name: 'Fase 2: Validación', description: 'Validar el mercado.' },
    { id: 3, name: 'Fase 3: Desarrollo', description: 'Construir el producto.' },
    { id: 4, name: 'Fase 4: Lanzamiento', description: 'Lanzar al mercado.' },
  ]

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Fases del Programa</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {phases.map(phase => (
          <div key={phase.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{phase.name}</h2>
            <p className="mb-4">{phase.description}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Ver Talleres y Tareas</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Phases