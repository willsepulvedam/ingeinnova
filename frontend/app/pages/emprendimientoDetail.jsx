import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'

export default function EmprendimientoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [emprendimiento, setEmprendimiento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const emp = await emprendimientoService.obtener(id)
      setEmprendimiento(emp)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { cargar() }, [cargar])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Cargando...
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">
          Error: {error}
          <button onClick={cargar} className="ml-3 underline text-sm">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-3xl">
      {/* Back */}
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
      >
        ← Volver al panel
      </Link>

      {/* Header del emprendimiento */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{emprendimiento?.nomProyecto}</h1>
            <p className="text-gray-500 mt-2">{emprendimiento?.descripcion}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><strong>Sector:</strong> {emprendimiento?.sector}</p>
              <p><strong>Cliente aspirado:</strong> {emprendimiento?.tipoClienteAspirado}</p>
              <p><strong>ID:</strong> {emprendimiento?.id}</p>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 bg-blue-100 text-blue-700">
            Activo
          </span>
        </div>
      </div>

      {/* Información complementaria */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="text-sm text-blue-800">
          <strong>✓ Detalle del emprendimiento</strong><br/>
          Detalles completos de etapas y progreso disponibles próximamente en futuras actualizaciones.
        </p>
      </div>
    </div>
  )
}