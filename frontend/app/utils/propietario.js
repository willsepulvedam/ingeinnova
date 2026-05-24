/** UUID aleatorio simple para propietario_id mientras no hay auth. */
function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getPropietarioId() {
  const stored = localStorage.getItem('propietario_id')
  if (stored) return stored
  const id = randomUUID()
  localStorage.setItem('propietario_id', id)
  return id
}
