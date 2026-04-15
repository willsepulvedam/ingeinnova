import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'

const ESTADO_BADGE = {
  ACTIVO: 'bg-green-100 text-green-700',
  INACTIVO: 'bg-gray-100 text-gray-500',
}

/** UUID aleatorio simple para propietario_id mientras no hay auth. */
function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const PROPIETARIO_ID =
  localStorage.getItem('propietario_id') ??
  (() => {
    const id = randomUUID()
    localStorage.setItem('propietario_id', id)
    return id
  })()

export default function Home() {
  const navigate = useNavigate()
  const [emprendimientos, setEmprendimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const cargar = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await emprendimientoService.listar()
      setEmprendimientos(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      await emprendimientoService.crear({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        propietario_id: PROPIETARIO_ID,
      })
      setForm({ nombre: '', descripcion: '' })
      setShowForm(false)
      await cargar()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emprendimientos</h1>
          <p className="text-gray-500 mt-1">Gestiona tus proyectos de emprendimiento</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
        >
          {showForm ? 'Cancelar' : '+ Nuevo'}
        </button>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-blue-100 rounded-xl p-6 mb-8 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Nuevo emprendimiento</h2>
          {formError && (
            <p className="text-red-600 text-sm mb-3 bg-red-50 p-3 rounded-lg">{formError}</p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={100}
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: TechFood Solutions"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              maxLength={500}
              required
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe brevemente tu emprendimiento..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            {saving ? 'Creando...' : 'Crear emprendimiento'}
          </button>
        </form>
      )}

      {/* Lista */}
      {loading && (
        <div className="text-center py-16 text-gray-500">Cargando emprendimientos...</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4">
          Error: {error}
          <button onClick={cargar} className="ml-3 underline text-sm">Reintentar</button>
        </div>
      )}
      {!loading && !error && emprendimientos.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🚀</div>
          <p>Aún no tienes emprendimientos. ¡Crea el primero!</p>
        </div>
      )}
      <div className="grid gap-4">
        {emprendimientos.map((emp) => (
          <div
            key={emp.id}
            onClick={() => navigate(`/emprendimiento/${emp.id}`)}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{emp.nombre}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{emp.descripcion}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${ESTADO_BADGE[emp.estado] ?? 'bg-gray-100 text-gray-500'}`}>
                {emp.estado}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Creado: {new Date(emp.fecha_creacion).toLocaleDateString('es-CO')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}