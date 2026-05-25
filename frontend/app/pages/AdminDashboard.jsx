import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { ButtonPrimary, ButtonSecondary, ButtonDanger, ButtonSmall } from '../components/Button'
import Modal, { ModalCloseButton } from '../components/Modal'

const ESTADO_BADGE = {
  ACTIVO: 'bg-green-100 text-green-700',
  INACTIVO: 'bg-gray-100 text-gray-600',
}

const SECTORES = [
  'Tecnología / Software',
  'Gastronomía / Alimentos',
  'Moda / Textil',
  'Artesanías / Diseño',
  'Servicios profesionales',
  'Educación / EdTech',
  'Otro',
]

const ESTADOS_MADUREZ = ['Idea / Proyecto', 'Prototipo', 'En marcha', 'Facturando']

const FORM_VACIO = {
  // Emprendimiento
  nombre: '',
  descripcion: '',
  sector: 'Tecnología / Software',
  estadoMaturez: 'Idea / Proyecto',
  tipoClienteAspira: 'B2C - Consumidor Final (Personas)',
  
  // Emprendedor (mínimo)
  emprendedorNombre: '',
  emprendedorCedula: '',
  emprendedorEmail: '',
  emprendedorTelefono: '',
  
  // Estado
  estado: 'ACTIVO',
}

function randomUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default function AdminDashboard() {
  const [emprendimientos, setEmprendimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)
  const [formError, setFormError] = useState(null)
  const [eliminarId, setEliminarId] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const cargar = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await emprendimientoService.listar()
      setEmprendimientos(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const abrirCrear = () => {
    setForm(FORM_VACIO)
    setFormError(null)
    setModal('crear')
  }

  const abrirEditar = (emp) => {
    setForm({
      nombre: emp.nomProyecto || emp.nom_proyecto || emp.nombre || '',
      descripcion: emp.descripcion || '',
      sector: emp.sector || 'Tecnología / Software',
      estadoMaturez: emp.estadoMaturez || emp.estadoMadurez || emp.estado_madurez || 'Idea / Proyecto',
      tipoClienteAspira:
        emp.tipoClienteAspira || emp.tipoClienteAspirado || emp.tipo_cliente_aspirado ||
        'B2C - Consumidor Final (Personas)',
      emprendedorNombre: emp.emprendedorNombre || '',
      emprendedorCedula: emp.emprendedorCedula || '',
      emprendedorEmail: emp.emprendedorEmail || '',
      emprendedorTelefono: emp.emprendedorTelefono || '',
      estado: emp.estado || 'ACTIVO',
    })
    setFormError(null)
    setModal({ tipo: 'editar', id: emp.id || emp.emprendimientoId || emp.emprendimiento_id })
  }

  const cerrarModal = () => {
    setModal(null)
    setFormError(null)
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setFormError('Nombre y descripción son obligatorios')
      return
    }

    setGuardando(true)
    setFormError(null)
    try {
      if (modal === 'crear') {
        // Crear payload completo para POST
        const payload = {
          nom_proyecto: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          sector: form.sector,
          estado_madurez: form.estadoMaturez,
          tipo_cliente_aspirado: form.tipoClienteAspira,
          emprendedor: {
            nom_completo: form.emprendedorNombre.trim() || 'Admin Creador',
            cedula: form.emprendedorCedula.trim() || randomUUID().slice(0, 10),
            email: form.emprendedorEmail.trim() || `admin-${Date.now()}@ingeinnova.local`,
            telefono: form.emprendedorTelefono.trim() || '+573001234567',
            sexo: 'Otro',
            edad: 0,
            barrio: 'N/A',
            localidad: '1 Localidad Histórica y del Caribe Norte',
            tipo_vinculo: 'Administrativo',
            categoria: 'Administrativo',
            password: 'Admin123456!',
            inf_academica: {
              semestre: 'N/A',
              programa: 'Administrativo',
              jornada: 'Diurna',
              ano_graduacion: null,
            },
            es_emprendedor: false,
          },
          detalles: {
            constituida_legalmente: 'No',
            nit_empresa: null,
            tiene_rut: 'No tiene',
            tiene_cvlac: false,
            tiempo_existencia: 'Menos de 1 año',
            cantidad_trabajadores: '1-3',
            tipo_negocio: 'Producto masivo',
            sector_economico: form.sector,
            es_familiar: 'No',
            familia_tiene_empresa: 'No',
            empresa_familia_legal: 'No',
            historial_quiebra: false,
            redes_sociales: null,
          },
        }

        await emprendimientoService.crear(payload)
      } else if (modal?.tipo === 'editar') {
        // Para actualizar, solo los campos mutables
        await emprendimientoService.actualizar(modal.id, {
          nom_proyecto: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          sector: form.sector,
          estado_madurez: form.estadoMaturez,
          tipo_cliente_aspirado: form.tipoClienteAspira,
        })
      }
      cerrarModal()
      await cargar()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async () => {
    if (!eliminarId) return
    setEliminando(true)
    try {
      await emprendimientoService.eliminar(eliminarId)
      setEliminarId(null)
      await cargar()
    } catch (err) {
      setError(err.message)
      setEliminarId(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl animate-page-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de administración</h1>
          <p className="text-gray-500 mt-1">
            {emprendimientos.length} emprendimiento{emprendimientos.length !== 1 ? 's' : ''}{' '}
            registrado{emprendimientos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <ButtonPrimary onClick={abrirCrear}>+ Nuevo emprendimiento</ButtonPrimary>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center justify-between">
          <span>Error: {error}</span>
          <button type="button" onClick={cargar} className="underline text-sm ml-3">
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center py-16 text-gray-500">Cargando emprendimientos...</p>
      ) : emprendimientos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No hay emprendimientos registrados.</p>
          <ButtonPrimary onClick={abrirCrear}>Crear el primero</ButtonPrimary>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Nombre</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden md:table-cell">
                    Descripción
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Sector</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                    Estado
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {emprendimientos.map((emp) => (
                  <tr key={emp.id || emp.emprendimiento_id} className="table-row-animated">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {emp.nomProyecto || emp.nom_proyecto || emp.nombre}
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell max-w-xs truncate">
                      {emp.descripcion}
                    </td>
                    <td className="px-5 py-4 text-gray-700 text-sm">
                      {emp.sector || 'N/A'}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          ESTADO_BADGE[emp.estado] ?? ESTADO_BADGE.INACTIVO
                        }`}
                      >
                        {emp.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Link to={`/admin/emprendimiento/${emp.id || emp.emprendimientoId || emp.emprendimiento_id}`}>
                          <ButtonSmall>Seguimiento</ButtonSmall>
                        </Link>
                        <ButtonSmall onClick={() => abrirEditar(emp)}>Editar</ButtonSmall>
                        <ButtonDanger
                          className="!px-3 !py-2 !text-sm !rounded-lg"
                          onClick={() => setEliminarId(emp.id || emp.emprendimientoId || emp.emprendimiento_id)}
                        >
                          Eliminar
                        </ButtonDanger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={cerrarModal}
        size="md"
        align="center"
        zIndex={50}
        ariaLabel={modal === 'crear' ? 'Nuevo emprendimiento' : 'Editar emprendimiento'}
      >
        <div className="relative p-6 md:p-8">
          <ModalCloseButton onClick={cerrarModal} />
          <h2 className="text-xl font-bold text-gray-900 mb-6 pr-10">
            {modal === 'crear' ? 'Nuevo emprendimiento' : 'Editar emprendimiento'}
          </h2>
          <form onSubmit={handleGuardar} className="space-y-4">
            {/* EMPRENDIMIENTO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del proyecto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                maxLength={255}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
                maxLength={1000}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SECTORES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de madurez <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.estadoMaturez}
                  onChange={(e) => setForm({ ...form, estadoMaturez: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ESTADOS_MADUREZ.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* EMPRENDEDOR MÍNIMO */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Datos del emprendedor</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={form.emprendedorNombre}
                  onChange={(e) => setForm({ ...form, emprendedorNombre: e.target.value })}
                  placeholder="Opcional"
                  maxLength={255}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula
                  </label>
                  <input
                    type="text"
                    value={form.emprendedorCedula}
                    onChange={(e) =>
                      setForm({ ...form, emprendedorCedula: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="Opcional"
                    maxLength={12}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.emprendedorEmail}
                    onChange={(e) => setForm({ ...form, emprendedorEmail: e.target.value })}
                    placeholder="Opcional"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={form.emprendedorTelefono}
                  onChange={(e) => setForm({ ...form, emprendedorTelefono: e.target.value })}
                  placeholder="Opcional"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {formError && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{formError}</p>
            )}

            <div className="flex gap-3 pt-2 border-t border-gray-200">
              <ButtonPrimary type="submit" disabled={guardando} className="flex-1">
                {guardando ? 'Guardando...' : 'Guardar'}
              </ButtonPrimary>
              <ButtonSecondary type="button" onClick={cerrarModal} className="flex-1">
                Cancelar
              </ButtonSecondary>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        open={!!eliminarId}
        onClose={() => setEliminarId(null)}
        size="sm"
        align="center"
        zIndex={50}
        ariaLabel="Confirmar eliminación"
      >
        <div className="relative p-6 md:p-8 text-center">
          <ModalCloseButton onClick={() => setEliminarId(null)} />
          <p className="text-lg font-semibold text-gray-900 mb-2 pr-8">¿Eliminar emprendimiento?</p>
          <p className="text-gray-600 text-sm mb-6">
            Se eliminará permanentemente junto con su ruta y etapas asociadas.
          </p>
          <div className="flex gap-3">
            <ButtonDanger className="flex-1" disabled={eliminando} onClick={handleEliminar}>
              {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
            </ButtonDanger>
            <ButtonSecondary className="flex-1" onClick={() => setEliminarId(null)}>
              Cancelar
            </ButtonSecondary>
          </div>
        </div>
      </Modal>
    </div>
  )
}