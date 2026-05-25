import { fetcher } from './api'

export const emprendimientoService = {
  /** Crea un emprendimiento. El back retorna { success, data } con el emprendimiento creado */
  crear: (data) =>
    fetcher('/api/v1/postulaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listar: () => fetcher('/api/v1/postulaciones'),

  obtener: (id) => fetcher(`/api/v1/postulaciones/${id}`),

  actualizar: (id, data) =>
    fetcher(`/api/v1/postulaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  eliminar: (id) =>
    fetcher(`/api/v1/postulaciones/${id}`, { method: 'DELETE' }),
}