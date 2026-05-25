const BASE_URL = 'http://localhost:8000'

/**
 * Convierte snake_case a camelCase recursivamente
 */
function snakeToCamel(obj) {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      acc[camelKey] = snakeToCamel(obj[key])
      return acc
    }, {})
  }
  return obj
}

/**
 * Helper base para todas las llamadas al backend.
 * Lanza un error con el mensaje del servidor si la respuesta no es OK.
 */
export async function fetcher(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    let message = `Error ${res.status}`
    try {
      const body = await res.json()
      
      // Si detail es un arreglo (típico error 422 de FastAPI/Pydantic), lo convertimos a texto legible
      if (Array.isArray(body.detail)) {
        message = body.detail.map(err => {
          // Extrae el campo y el mensaje de error si vienen en el formato estándar
          const field = err.loc ? err.loc.join(' -> ') : 'Campo desconocido';
          const msg = err.msg || JSON.stringify(err);
          return `${field}: ${msg}`;
        }).join(' | ');
      } else {
        // Si es un mensaje de texto normal o un objeto simple
        message = body.detail ?? body.message ?? message
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  // 204 No Content
  if (res.status === 204) return null
  
  const json = await res.json()
  // El backend retorna { success, data, message }
  // Extraer el data y convertir snake_case a camelCase
  if (json.data) {
    return snakeToCamel(json.data)
  }
  return snakeToCamel(json)
}