import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import FormularioEmprendimiento from '../components/Formularioemprendimiento'

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
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

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

  const handleSubmitForm = async (formData) => {
    setSaving(true)
    setFormError(null)
    try {
      // Mapear datos del formulario completo al formato que acepta el backend
      // Por ahora, el backend solo acepta nombre, descripción y propietario_id
      // Se puede expandir para enviar más datos
      const datosEmprendimiento = {
        nombre: formData.nombre_emprendimiento.trim(),
        descripcion: formData.descripcion_emprendimiento.trim(),
        propietario_id: PROPIETARIO_ID,
        // Datos adicionales que pueden procesarse en el futuro:
        // nombre_emprendedor: formData.nombre_completo,
        // correo: formData.correo,
        // telefono: formData.telefono,
        // tipo: formData.tipo_emprendimiento,
        // sector: formData.sector_economico,
      }

      await emprendimientoService.crear(datosEmprendimiento)
      
      setSuccessMsg('¡Emprendimiento registrado exitosamente!')
      setShowForm(false)
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMsg(null), 3000)
      
      // Recargar la lista
      await cargar()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emprendimientos</h1>
          <p className="text-gray-500 mt-1">Gestiona tus proyectos de emprendimiento</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
          >
            + Nueva Inscripción
          </button>
        )}
      </div>

      {/* Mensaje de éxito */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 animate-pulse">
          ✓ {successMsg}
        </div>
      )}

      {/* Formulario multi-paso */}
      {showForm && (
        <div className="mb-8">
          <FormularioEmprendimiento
            onSubmit={handleSubmitForm}
            onCancel={() => {
              setShowForm(false)
              setFormError(null)
            }}
            loading={saving}
          />
          {formError && (
            <p className="text-red-600 text-sm mt-3 bg-red-50 p-3 rounded-lg">
              Error: {formError}
            </p>
          )}
        </div>
      )}

      {/* Lista de emprendimientos */}
      {loading && (
        <div className="text-center py-16 text-gray-500">Cargando emprendimientos...</div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4">
          Error: {error}
          <button onClick={cargar} className="ml-3 underline text-sm">Reintentar</button>
        </div>
      )}
      
      {!loading && !error && emprendimientos.length === 0 && !showForm && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🚀</div>
          <p>Aún no tienes emprendimientos registrados.</p>
          <p className="text-sm mt-2">¡Crea el primero haciendo clic en "Nueva Inscripción"!</p>
        </div>
      )}
      
      {!loading && emprendimientos.length > 0 && (
        <div className="grid gap-4">
          <div className="text-sm text-gray-600 mb-2">
            {emprendimientos.length} emprendimiento{emprendimientos.length !== 1 ? 's' : ''} registrado{emprendimientos.length !== 1 ? 's' : ''}
          </div>
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
      )}
    </div>
  )
}