import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { rutaService } from '../services/RutaService'
import { etapaService } from '../services/EtapaService'
import { ButtonPrimary } from '../components/Button'

const ESTADO_COLOR = {
  COMPLETADA: { badge: 'bg-green-100 text-green-700', icon: '✅' },
  EN_PROGRESO: { badge: 'bg-blue-100 text-blue-700', icon: '🔵' },
  BLOQUEADA: { badge: 'bg-gray-100 text-gray-500', icon: '🔒' },
}

export default function AdminEmprendimientoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [emprendimiento, setEmprendimiento] = useState(null)
  const [ruta, setRuta] = useState(null)
  const [etapas, setEtapas] = useState([])
  const [progreso, setProgreso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [avanzando, setAvanzando] = useState(false)
  const [avanceMsg, setAvanceMsg] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

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
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    cargar()
  }, [cargar])

  const handleAvanzar = async () => {
    if (!ruta) return
    setAvanzando(true)
    setAvanceMsg(null)
    try {
      await rutaService.avanzar(ruta.id)
      setAvanceMsg({ tipo: 'ok', texto: 'Etapa completada y ruta avanzada.' })
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
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Cargando seguimiento...
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

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-3xl animate-page-in">
      <Link
        to="/admin"
        className="text-slate-600 hover:underline text-sm mb-6 inline-flex items-center gap-1"
      >
        ← Volver al listado
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Seguimiento</p>
            <h1 className="text-2xl font-bold text-gray-900">{emprendimiento?.nombre}</h1>
            <p className="text-gray-500 mt-2">{emprendimiento?.descripcion}</p>
            <p className="text-xs text-gray-400 mt-3 font-mono">ID: {emprendimiento?.id}</p>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
              emprendimiento?.estado === 'ACTIVO'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {emprendimiento?.estado}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Propietario: {emprendimiento?.propietario_id} · Creado:{' '}
          {new Date(emprendimiento?.fecha_creacion).toLocaleDateString('es-CO')}
        </p>
      </div>

      {progreso && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de la ruta</span>
            <span className="text-sm font-bold text-slate-700">
              {progreso.progreso?.toFixed(0) ?? 0}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-slate-600 h-3 rounded-full progress-bar-animated"
              style={{ width: `${progreso.progreso ?? 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {progreso.etapas_completadas} de {progreso.total_etapas} etapas completadas
          </p>
          {ruta && (
            <p className="text-xs text-gray-500 mt-1">Etapa actual de ruta: {ruta.etapa_actual}</p>
          )}
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Etapas del programa</h2>
      <div className="space-y-3 mb-6">
        {etapas.map((etapa) => {
          const colors = ESTADO_COLOR[etapa.estado] ?? ESTADO_COLOR.BLOQUEADA
          return (
            <div
              key={etapa.id}
              className={`bg-white border rounded-xl p-5 shadow-sm ${
                etapa.estado === 'EN_PROGRESO' ? 'border-slate-400 ring-1 ring-slate-200' : 'border-gray-200'
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
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center mb-4">
          <p className="font-semibold text-green-700">Todas las etapas completadas.</p>
        </div>
      ) : etapaEnProgreso ? (
        <ButtonPrimary
          onClick={handleAvanzar}
          disabled={avanzando}
          className="w-full !rounded-xl"
        >
          {avanzando
            ? 'Avanzando...'
            : `Completar "${etapaEnProgreso.nombre}" y avanzar →`}
        </ButtonPrimary>
      ) : null}

      <button
        type="button"
        onClick={() => navigate('/admin')}
        className="w-full mt-4 text-sm text-slate-600 hover:underline"
      >
        Volver al panel admin
      </button>
    </div>
  )
}
