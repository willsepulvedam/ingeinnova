import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { getSession } from '../services/authService'
import { rutaService } from '../services/RutaService'

export default function Profile() {
  const [emprendimiento, setEmprendimiento] = useState(null)
  const [ruta, setRuta] = useState(null)
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
        const rut = await rutaService.obtenerPorEmprendimiento(emp.id)
        setRuta(rut)
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{emprendimiento.nombre}</h2>
        <p className="text-gray-600 mb-6">{emprendimiento.descripcion}</p>

        <dl className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-gray-500 font-medium">Estado</dt>
            <dd className="text-gray-900 mt-1">{emprendimiento.estado}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">Fecha de registro</dt>
            <dd className="text-gray-900 mt-1">
              {new Date(emprendimiento.fecha_creacion).toLocaleDateString('es-CO')}
            </dd>
          </div>
          {ruta && (
            <>
              <div>
                <dt className="text-gray-500 font-medium">Etapa actual de la ruta</dt>
                <dd className="text-gray-900 mt-1">{ruta.etapa_actual}</dd>
              </div>
              <div>
                <dt className="text-gray-500 font-medium">Inicio de ruta</dt>
                <dd className="text-gray-900 mt-1">
                  {new Date(ruta.fecha_inicio).toLocaleDateString('es-CO')}
                </dd>
              </div>
            </>
          )}
        </dl>

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
