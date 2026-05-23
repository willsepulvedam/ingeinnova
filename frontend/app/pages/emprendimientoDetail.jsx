import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { rutaService } from '../services/RutaService'
import { etapaService } from '../services/EtapaService'

const ESTADO_COLOR = {
  COMPLETADA: { bar: 'bg-green-500', badge: 'bg-green-100 text-green-700', icon: '✅' },
  EN_PROGRESO: { bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', icon: '🔵' },
  BLOQUEADA: { bar: 'bg-gray-200', badge: 'bg-gray-100 text-gray-500', icon: '🔒' },
}

export default function EmprendimientoDetail() {
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
      // Ordenar etapas por su campo `orden`
      setEtapas([...etps].sort((a, b) => a.orden - b.orden))

      // Obtener progreso usando el id de la ruta
      const prog = await rutaService.obtenerProgreso(rut.id)
      setProgreso(prog)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { cargar() }, [cargar])

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
      <button
        onClick={() => navigate('/dashboard')}
        className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
      >
        ← Volver al panel
      </button>

      {/* Header del emprendimiento */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{emprendimiento?.nombre}</h1>
            <p className="text-gray-500 mt-2">{emprendimiento?.descripcion}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
            emprendimiento?.estado === 'ACTIVO'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {emprendimiento?.estado}
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      {progreso && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de la ruta</span>
            <span className="text-sm font-bold text-blue-600">{progreso.progreso?.toFixed(0) ?? 0}%</span>
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
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Etapas del programa</h2>
        <div className="space-y-3">
          {etapas.map((etapa) => {
            const colors = ESTADO_COLOR[etapa.estado] ?? ESTADO_COLOR.BLOQUEADA
            return (
              <div
                key={etapa.id}
                className={`bg-white border rounded-xl p-5 shadow-sm transition ${
                  etapa.estado === 'EN_PROGRESO' ? 'border-blue-300 ring-1 ring-blue-200' : 'border-gray-200'
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
      </div>

      {/* Acción: Avanzar */}
      {avanceMsg && (
        <div className={`p-4 rounded-xl mb-4 text-sm ${
          avanceMsg.tipo === 'ok'
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
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
          onClick={handleAvanzar}
          disabled={avanzando}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
        >
          {avanzando
            ? 'Avanzando...'
            : `Completar "${etapaEnProgreso.nombre}" y avanzar →`}
        </button>
      ) : null}
    </div>
  )
}