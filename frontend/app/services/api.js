const BASE_URL = 'http://localhost:8000'

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
      message = body.detail ?? message
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  // 204 No Content
  if (res.status === 204) return null
  return res.json()
}