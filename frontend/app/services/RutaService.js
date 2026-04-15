import { fetcher } from './api'

export const rutaService = {
  /** Obtiene la ruta de un emprendimiento por su ID. */
  obtenerPorEmprendimiento: (emprendimientoId) =>
    fetcher(`/ruta/${emprendimientoId}`),

  /** Completa la etapa EN_PROGRESO y activa la siguiente. */
  avanzar: (rutaId) =>
    fetcher(`/ruta/${rutaId}/avanzar`, { method: 'POST' }),

  /** Retorna { total_etapas, etapas_completadas, progreso } */
  obtenerProgreso: (rutaId) =>
    fetcher(`/ruta/${rutaId}/progreso`),
}