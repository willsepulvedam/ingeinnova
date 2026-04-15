import { fetcher } from './api'

export const emprendimientoService = {
  /** Crea un emprendimiento. El back crea automáticamente la ruta y las 4 etapas. */
  crear: (data) =>
    fetcher('/emprendimiento/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listar: () => fetcher('/emprendimiento/'),

  obtener: (id) => fetcher(`/emprendimiento/${id}`),

  actualizar: (id, data) =>
    fetcher(`/emprendimiento/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  eliminar: (id) =>
    fetcher(`/emprendimiento/${id}`, { method: 'DELETE' }),
}