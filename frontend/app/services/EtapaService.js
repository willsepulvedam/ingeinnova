import { fetcher } from './api'

export const etapaService = {
  /** Lista todas las etapas de un emprendimiento (usa emprendimiento_id). */
  listarPorEmprendimiento: (emprendimientoId) =>
    fetcher(`/etapas/${emprendimientoId}`),

  obtenerDetalle: (etapaId) =>
    fetcher(`/etapas/${etapaId}/detalle`),

  completar: (etapaId) =>
    fetcher(`/etapas/${etapaId}/completar`, { method: 'POST' }),
}