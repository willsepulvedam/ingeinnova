import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { ButtonPrimary, ButtonSecondary, ButtonDanger, ButtonSmall } from '../components/Button'
import Modal, { ModalCloseButton } from '../components/Modal'

const ESTADO_BADGE = {
  ACTIVO: 'bg-green-100 text-green-700',
  INACTIVO: 'bg-gray-100 text-gray-600',
}

const FORM_VACIO = { nombre: '', descripcion: '', estado: 'ACTIVO' }

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
      setEmprendimientos(data)
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
      nombre: emp.nombre,
      descripcion: emp.descripcion,
      estado: emp.estado,
    })
    setFormError(null)
    setModal({ tipo: 'editar', id: emp.id })
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
        await emprendimientoService.crear({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          propietario_id: randomUUID(),
        })
      } else if (modal?.tipo === 'editar') {
        await emprendimientoService.actualizar(modal.id, {
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          estado: form.estado,
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
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Estado</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                    Fecha
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {emprendimientos.map((emp) => (
                  <tr key={emp.id} className="table-row-animated">
                    <td className="px-5 py-4 font-medium text-gray-900">{emp.nombre}</td>
                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell max-w-xs truncate">
                      {emp.descripcion}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          ESTADO_BADGE[emp.estado] ?? ESTADO_BADGE.INACTIVO
                        }`}
                      >
                        {emp.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                      {new Date(emp.fecha_creacion).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Link to={`/admin/emprendimiento/${emp.id}`}>
                          <ButtonSmall>Seguimiento</ButtonSmall>
                        </Link>
                        <ButtonSmall onClick={() => abrirEditar(emp)}>Editar</ButtonSmall>
                        <ButtonDanger
                          className="!px-3 !py-2 !text-sm !rounded-lg"
                          onClick={() => setEliminarId(emp.id)}
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
        size="sm"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  maxLength={100}
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
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {modal !== 'crear' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>
              )}
              {formError && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{formError}</p>
              )}
              <div className="flex gap-3 pt-2">
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
