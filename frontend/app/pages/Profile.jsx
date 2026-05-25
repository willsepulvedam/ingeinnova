import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { getSession } from '../services/authService'

export default function Profile() {
  const [emprendimiento, setEmprendimiento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)
        const session = getSession()
        let emp = null
        if (session?.emprendimientoId) {
          emp = await emprendimientoService.obtener(session.emprendimientoId)
        } else {
          const lista = await emprendimientoService.listar()
          if (lista.length === 0) {
            setEmprendimiento(null)
            return
          }
          emp = lista[0]
        }
        setEmprendimiento(emp)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-8 text-center text-gray-500">Cargando perfil...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">Error: {error}</div>
      </div>
    )
  }

  if (!emprendimiento) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-gray-600 mb-4">No hay emprendimiento registrado.</p>
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          Ir a inscripción
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Perfil del emprendimiento</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{emprendimiento.nomProyecto}</h2>
        <p className="text-gray-600 mb-6">{emprendimiento.descripcion}</p>

        <dl className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-gray-500 font-medium">Sector</dt>
            <dd className="text-gray-900 mt-1">{emprendimiento.sector}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">Cliente aspirado</dt>
            <dd className="text-gray-900 mt-1">{emprendimiento.tipoClienteAspirado}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">ID del emprendimiento</dt>
            <dd className="text-gray-900 mt-1 font-mono text-xs">{emprendimiento.id}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">Estado</dt>
            <dd className="text-gray-900 mt-1">Activo</dd>
          </div>
        </dl>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>✓ Información actualizada</strong><br/>
            Tu perfil se ha creado exitosamente. Acceso a etapas y progreso disponible próximamente.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-block mt-6 text-blue-600 hover:underline text-sm font-medium"
        >
          ← Volver al panel
        </Link>
      </div>
    </div>
  )
}
