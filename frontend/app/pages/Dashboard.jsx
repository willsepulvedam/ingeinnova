import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { getSession } from '../services/authService'
import { rutaService } from '../services/RutaService'
import { etapaService } from '../services/EtapaService'

const ESTADO_COLOR = {
  COMPLETADA: { badge: 'bg-green-100 text-green-700', icon: '✅' },
  EN_PROGRESO: { badge: 'bg-blue-100 text-blue-700', icon: '🔵' },
  BLOQUEADA: { badge: 'bg-gray-100 text-gray-500', icon: '🔒' },
}

export default function Dashboard() {
  const [emprendimiento, setEmprendimiento] = useState(null)
  const [ruta, setRuta] = useState(null)
  const [etapas, setEtapas] = useState([])
  const [progreso, setProgreso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [avanzando, setAvanzando] = useState(false)
  const [avanceMsg, setAvanceMsg] = useState(null)

  const cargarEmprendimiento = useCallback(async (id) => {
    const [emp, rut, etps] = await Promise.all([
      emprendimientoService.obtener(id),
      rutaService.obtenerPorEmprendimiento(id),
      etapaService.listarPorEmprendimiento(id),
    ])
    setEmprendimiento(emp)
    setRuta(rut)
    setEtapas([...etps].sort((a, b) => a.orden - b.orden))
    const prog = await rutaService.obtenerProgreso(rut.id)
    setProgreso(prog)
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

  const handleAvanzar = async () => {
    if (!ruta) return
    setAvanzando(true)
    setAvanceMsg(null)
    try {
      await rutaService.avanzar(ruta.id)
      setAvanceMsg({ tipo: 'ok', texto: '¡Etapa completada! Se ha avanzado a la siguiente.' })
      await cargar()
    } catch (e) {
      setAvanceMsg({ tipo: 'error', texto: e.message })
    } finally {
      setAvanzando(false)
    }
  }

  const etapaEnProgreso = etapas.find((e) => e.estado === 'EN_PROGRESO')
  const todasCompletadas = etapas.length > 0 && etapas.every((e) => e.estado === 'COMPLETADA')

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
              <h3 className="text-xl font-bold text-gray-900">{emprendimiento.nombre}</h3>
              <p className="text-gray-600 mt-2">{emprendimiento.descripcion}</p>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                emprendimiento.estado === 'ACTIVO'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {emprendimiento.estado}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Registrado: {new Date(emprendimiento.fecha_creacion).toLocaleDateString('es-CO')}
          </p>
          <Link
            to={`/emprendimiento/${emprendimiento.id}`}
            className="inline-block mt-4 text-sm text-blue-600 hover:underline"
          >
            Ver detalle completo →
          </Link>
        </div>
      </section>

      {/* Progreso */}
      {progreso && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de la ruta</span>
            <span className="text-sm font-bold text-blue-600">
              {progreso.progreso?.toFixed(0) ?? 0}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full progress-bar-animated"
              style={{ width: `${progreso.progreso ?? 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {progreso.etapas_completadas} de {progreso.total_etapas} etapas completadas
          </p>
        </div>
      )}

      {/* Etapas */}
      <section aria-labelledby="etapas-heading">
        <h2 id="etapas-heading" className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span> Mis etapas
        </h2>
        <div className="space-y-3 mb-6">
          {etapas.map((etapa) => {
            const colors = ESTADO_COLOR[etapa.estado] ?? ESTADO_COLOR.BLOQUEADA
            return (
              <div
                key={etapa.id}
                className={`card-hover bg-white border rounded-xl p-5 shadow-sm transition ${
                  etapa.estado === 'EN_PROGRESO'
                    ? 'border-blue-300 ring-1 ring-blue-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{colors.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Etapa {etapa.orden}: {etapa.nombre}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{etapa.descripcion}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${colors.badge}`}>
                    {etapa.estado.replace('_', ' ')}
                  </span>
                </div>
                {etapa.fecha_completada && (
                  <p className="text-xs text-gray-400 mt-3">
                    Completada: {new Date(etapa.fecha_completada).toLocaleDateString('es-CO')}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {avanceMsg && (
          <div
            className={`p-4 rounded-xl mb-4 text-sm ${
              avanceMsg.tipo === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {avanceMsg.texto}
          </div>
        )}

        {todasCompletadas ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-semibold text-green-700">¡Felicitaciones! Todas las etapas completadas.</p>
          </div>
        ) : etapaEnProgreso ? (
          <button
            type="button"
            onClick={handleAvanzar}
            disabled={avanzando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
          >
            {avanzando
              ? 'Avanzando...'
              : `Completar "${etapaEnProgreso.nombre}" y avanzar →`}
          </button>
        ) : null}
      </section>
    </div>
  )
}
