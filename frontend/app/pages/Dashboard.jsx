import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { getSession } from '../services/authService'

export default function Dashboard() {
  const [emprendimiento, setEmprendimiento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarEmprendimiento = useCallback(async (id) => {
    try {
      const emp = await emprendimientoService.obtener(id)
      setEmprendimiento(emp)
      // Solo cargar rutas y etapas si existen endpoints que los soporten
      // Por ahora, simplemente mostramos el emprendimiento
    } catch (e) {
      throw e
    }
  }, [])

  const cargar = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const session = getSession()
      if (session?.emprendimientoId) {
        await cargarEmprendimiento(session.emprendimientoId)
        return
      }
      const lista = await emprendimientoService.listar()
      if (lista.length === 0) {
        setEmprendimiento(null)
        return
      }
      await cargarEmprendimiento(lista[0].id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [cargarEmprendimiento])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-500">
        Cargando tu panel...
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">
          Error: {error}
          <button type="button" onClick={cargar} className="ml-3 underline text-sm">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!emprendimiento) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 max-w-lg text-center">
        <div className="text-5xl mb-4">🚀</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Aún no tienes un emprendimiento</h1>
        <p className="text-gray-600 mb-6">
          Inscríbete desde la página de inicio para acceder a tu perfil y etapas.
        </p>
        <Link
          to="/"
          state={{ openLogin: true }}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-3xl animate-page-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi panel</h1>
        <p className="text-gray-500 mt-1">Perfil y avance de tu emprendimiento</p>
      </div>

      {/* Perfil */}
      <section className="mb-8" aria-labelledby="perfil-heading">
        <h2 id="perfil-heading" className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>👤</span> Perfil del emprendimiento
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{emprendimiento.nomProyecto}</h3>
              <p className="text-gray-600 mt-2">{emprendimiento.descripcion}</p>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 bg-blue-100 text-blue-700`}
            >
              Activo
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-4">ID: {emprendimiento.id}</p>
          <Link
            to={`/emprendimiento/${emprendimiento.id}`}
            className="inline-block mt-4 text-sm text-blue-600 hover:underline"
          >
            Ver detalle completo →
          </Link>
        </div>
      </section>

      {/* Progreso */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8 shadow-sm">
        <p className="text-sm text-gray-600">
          Tu ruta de emprendimiento te guiará a través de 4 etapas estratégicas. Más información próximamente.
        </p>
      </div>

      {/* Información complementaria */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="text-sm text-blue-800">
          <strong>✓ ¡Bienvenido a INGEINNOVA!</strong> Tu emprendimiento ha sido registrado correctamente. Podrás ver más detalles y realizar seguimiento de tu ruta en próximas actualizaciones.
        </p>
      </div>
    </div>
  )
}
