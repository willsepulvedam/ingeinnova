import { useState } from 'react'
import { H3, BodyText } from './Typography'
import { ButtonPrimary, ButtonSecondary } from './Button'

const MAX_PERSONAS = 4

const crearPersonaVacia = () => ({
  categoria: '',
  nombre_completo: '',
  cedula: '',
  correo: '',
  telefono: '',
  barrio: '',
  localidad: '',
})

/**
 * Formulario multi-paso para inscripción en ruta de emprendimiento INGEINNOVA
 * Captura todos los campos del formulario PDF
 */
export default function FormularioEmprendimiento({ onSubmit, onCancel, loading = false }) {
  const [paso, setPaso] = useState(1)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    personas: [crearPersonaVacia()],

    // Datos académicos
    semestre: '',
    programa: '',
    jornada: '',
    año_graduacion: '',

    // Emprendimiento info
    nombre_emprendimiento: '',
    descripcion_emprendimiento: '',
    tipo_emprendimiento: '',
    sector_economico: '',

    // Empresa existente
    empresa_constituida: 'No aplico',
    nit_empresa: '',
    tiempo_emprendimiento: 'No tengo emprendimiento',
    familiar: 'No',
    empresa_familia: 'No aplico',

    // Otros
    quiebra_anterior: 'No',
    cvlac: 'No',
    rut: 'No',
    redes_sociales: '',
  })

  const totalPasos = 4
  const categoriaPrincipal = form.personas[0]?.categoria ?? ''

  const errorKeyPersona = (index, campo) => `persona_${index}_${campo}`

  const validarCedula = (cedula) => /^\d{6,12}$/.test(cedula.replace(/\s/g, ''))

  const agregarPersona = () => {
    if (form.personas.length >= MAX_PERSONAS) return
    setForm({ ...form, personas: [...form.personas, crearPersonaVacia()] })
  }

  const eliminarPersona = (index) => {
    if (form.personas.length <= 1) return
    const personas = form.personas.filter((_, i) => i !== index)
    setForm({ ...form, personas })
    const nuevosErrores = { ...errors }
    Object.keys(nuevosErrores).forEach((key) => {
      if (key.startsWith(`persona_${index}_`)) delete nuevosErrores[key]
    })
    setErrors(nuevosErrores)
  }

  const actualizarPersona = (index, campo, valor) => {
    const personas = form.personas.map((p, i) =>
      i === index ? { ...p, [campo]: valor } : p
    )
    setForm({ ...form, personas })
    const key = errorKeyPersona(index, campo)
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' })
    }
  }

  // Validación de campos por paso
  const validarPaso = (numeroPaso) => {
    const nuevosErrores = {}

    if (numeroPaso === 1) {
      form.personas.forEach((persona, index) => {
        if (!persona.categoria) {
          nuevosErrores[errorKeyPersona(index, 'categoria')] = 'Selecciona una categoría'
        }
        if (!persona.nombre_completo?.trim()) {
          nuevosErrores[errorKeyPersona(index, 'nombre_completo')] = 'El nombre es requerido'
        }
        if (!persona.cedula?.trim()) {
          nuevosErrores[errorKeyPersona(index, 'cedula')] = 'La cédula es requerida'
        } else if (!validarCedula(persona.cedula)) {
          nuevosErrores[errorKeyPersona(index, 'cedula')] = 'Ingresa una cédula válida (solo números, 6 a 12 dígitos)'
        }
        if (!persona.correo?.trim()) {
          nuevosErrores[errorKeyPersona(index, 'correo')] = 'El correo es requerido'
        } else if (!persona.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          nuevosErrores[errorKeyPersona(index, 'correo')] = 'Correo inválido'
        }
        if (!persona.telefono?.trim()) {
          nuevosErrores[errorKeyPersona(index, 'telefono')] = 'El teléfono es requerido'
        }
        if (!persona.localidad) {
          nuevosErrores[errorKeyPersona(index, 'localidad')] = 'Selecciona una localidad'
        }
      })

      const cedulas = form.personas.map((p) => p.cedula?.trim()).filter(Boolean)
      const cedulasDuplicadas = cedulas.filter((c, i) => cedulas.indexOf(c) !== i)
      form.personas.forEach((persona, index) => {
        if (persona.cedula?.trim() && cedulasDuplicadas.includes(persona.cedula.trim())) {
          nuevosErrores[errorKeyPersona(index, 'cedula')] = 'Esta cédula ya fue registrada en otra persona'
        }
      })
    }

    if (numeroPaso === 2) {
      if (!form.semestre && categoriaPrincipal === 'Estudiante') {
        nuevosErrores.semestre = 'Selecciona el semestre'
      }
      if (!form.programa && categoriaPrincipal !== 'Administrativo') {
        nuevosErrores.programa = 'Selecciona el programa'
      }
      if (!form.jornada && categoriaPrincipal !== 'Administrativo') {
        nuevosErrores.jornada = 'Selecciona la jornada'
      }
    }

    if (numeroPaso === 3) {
      if (!form.nombre_emprendimiento?.trim()) {
        nuevosErrores.nombre_emprendimiento = 'El nombre del emprendimiento es requerido'
      }
      if (!form.descripcion_emprendimiento?.trim()) {
        nuevosErrores.descripcion_emprendimiento = 'La descripción es requerida'
      }
      if (!form.tipo_emprendimiento) {
        nuevosErrores.tipo_emprendimiento = 'Selecciona el tipo de emprendimiento'
      }
      if (!form.sector_economico) {
        nuevosErrores.sector_economico = 'Selecciona el sector económico'
      }
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleChangeInput = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleChangeSelect = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleAvanzar = () => {
    if (validarPaso(paso)) {
      setPaso(paso + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleRetroceder = () => {
    setPaso(paso - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validarPaso(paso)) {
      onSubmit(form)
    }
  }

  const renderCampoError = (nombre) => {
    if (errors[nombre]) {
      return <p className="text-red-500 text-sm mt-1">{errors[nombre]}</p>
    }
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <H3>Inscripción INGEINNOVA</H3>
          <span className="text-sm font-medium text-gray-500">
            Paso {paso} de {totalPasos}
          </span>
        </div>
        {/* Barra de progreso */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full progress-bar-animated"
            style={{ width: `${(paso / totalPasos) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* PASO 1: Datos de las personas (hasta 4) */}
        {paso === 1 && (
          <div className="space-y-6">
            <BodyText className="text-blue-600">
              Registra a las personas del equipo. Puedes agregar hasta {MAX_PERSONAS} integrantes.
            </BodyText>

            {form.personas.map((persona, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 bg-gray-50/80 space-y-4 transition-all duration-300 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-gray-900">
                    Persona {index + 1}
                    {index === 0 && (
                      <span className="ml-2 text-xs font-normal text-blue-600">(contacto principal)</span>
                    )}
                  </h4>
                  {form.personas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarPersona(index)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Quitar
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={persona.categoria}
                    onChange={(e) => actualizarPersona(index, 'categoria', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                      errors[errorKeyPersona(index, 'categoria')]
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Egresado">Egresado</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                  {renderCampoError(errorKeyPersona(index, 'categoria'))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={persona.nombre_completo}
                      onChange={(e) => actualizarPersona(index, 'nombre_completo', e.target.value)}
                      placeholder="Ej: Juan Carlos Pérez García"
                      maxLength={100}
                      className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                        errors[errorKeyPersona(index, 'nombre_completo')]
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {renderCampoError(errorKeyPersona(index, 'nombre_completo'))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cédula <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={persona.cedula}
                      onChange={(e) =>
                        actualizarPersona(index, 'cedula', e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="Ej: 1234567890"
                      maxLength={12}
                      className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                        errors[errorKeyPersona(index, 'cedula')]
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {renderCampoError(errorKeyPersona(index, 'cedula'))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={persona.correo}
                    onChange={(e) => actualizarPersona(index, 'correo', e.target.value)}
                    placeholder="tu.email@unicolombo.edu.co"
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                      errors[errorKeyPersona(index, 'correo')]
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {renderCampoError(errorKeyPersona(index, 'correo'))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={persona.telefono}
                    onChange={(e) => actualizarPersona(index, 'telefono', e.target.value)}
                    placeholder="3001234567"
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                      errors[errorKeyPersona(index, 'telefono')]
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {renderCampoError(errorKeyPersona(index, 'telefono'))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barrio donde resides
                  </label>
                  <input
                    type="text"
                    value={persona.barrio}
                    onChange={(e) => actualizarPersona(index, 'barrio', e.target.value)}
                    placeholder="Ej: Centro"
                    maxLength={50}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localidad donde resides <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={persona.localidad}
                    onChange={(e) => actualizarPersona(index, 'localidad', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                      errors[errorKeyPersona(index, 'localidad')]
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="1">Localidad Histórica y del Caribe Norte</option>
                    <option value="2">Localidad de la Virgen y Turística</option>
                    <option value="3">Localidad Industrial y de la Bahía</option>
                    <option value="Turbaco">Turbaco</option>
                    <option value="Bayunca">Bayunca</option>
                  </select>
                  {renderCampoError(errorKeyPersona(index, 'localidad'))}
                </div>
              </div>
            ))}

            {form.personas.length < MAX_PERSONAS && (
              <button
                type="button"
                onClick={agregarPersona}
                className="btn-interactive w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-400"
              >
                + Agregar otra persona ({form.personas.length}/{MAX_PERSONAS})
              </button>
            )}
          </div>
        )}

        {/* PASO 2: Datos Académicos */}
        {paso === 2 && (
          <div className="space-y-5">
            <BodyText className="text-blue-600 mb-4">
              Completa la información de tu formación académica
            </BodyText>

            {categoriaPrincipal === 'Estudiante' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semestre <span className="text-red-500">*</span>
                </label>
                <select
                  name="semestre"
                  value={form.semestre}
                  onChange={handleChangeSelect}
                  className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                    errors.semestre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">-- Selecciona --</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                {renderCampoError('semestre')}
              </div>
            )}

            {categoriaPrincipal !== 'Administrativo' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Programa Académico <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="programa"
                    value={form.programa}
                    onChange={handleChangeSelect}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                      errors.programa ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="Ingenieria Industrial">Ingeniería Industrial</option>
                    <option value="Ingenieria de Sistemas">Ingeniería de Sistemas</option>
                    <option value="Derecho">Derecho</option>
                    <option value="Administracion de empresas">Administración de empresas</option>
                    <option value="Bilinguismo">Licenciatura en Bilingüismo</option>
                    <option value="Contaduria">Contaduría Pública</option>
                    <option value="Otros">Otros</option>
                  </select>
                  {renderCampoError('programa')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jornada Académica <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jornada"
                    value={form.jornada}
                    onChange={handleChangeSelect}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                      errors.jornada ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="Diurna">Diurna</option>
                    <option value="Nocturna">Nocturna</option>
                    <option value="Egresado">Egresado</option>
                  </select>
                  {renderCampoError('jornada')}
                </div>
              </>
            )}

            {categoriaPrincipal === 'Egresado' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año de Graduación <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="año_graduacion"
                  value={form.año_graduacion}
                  onChange={handleChangeInput}
                  min="2000"
                  max={new Date().getFullYear()}
                  placeholder="2024"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        )}

        {/* PASO 3: Datos del Emprendimiento */}
        {paso === 3 && (
          <div className="space-y-5">
            <BodyText className="text-blue-600 mb-4">
              Cuéntanos sobre tu emprendimiento o idea de negocio
            </BodyText>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Emprendimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre_emprendimiento"
                value={form.nombre_emprendimiento}
                onChange={handleChangeInput}
                placeholder="Ej: TechFood Solutions"
                maxLength={100}
                className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.nombre_emprendimiento ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {renderCampoError('nombre_emprendimiento')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion_emprendimiento"
                value={form.descripcion_emprendimiento}
                onChange={handleChangeInput}
                placeholder="Describe brevemente tu emprendimiento, su propósito y valor..."
                rows={4}
                maxLength={500}
                className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 resize-none ${
                  errors.descripcion_emprendimiento ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {renderCampoError('descripcion_emprendimiento')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Emprendimiento <span className="text-red-500">*</span>
              </label>
              <select
                name="tipo_emprendimiento"
                value={form.tipo_emprendimiento}
                onChange={handleChangeSelect}
                className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.tipo_emprendimiento ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">-- Selecciona --</option>
                <option value="Restaurante">Restaurante</option>
                <option value="Venta comida rapida">Venta de comida rápida</option>
                <option value="Reposteria">Repostería o pastelería</option>
                <option value="Tienda ropa">Tienda de ropa</option>
                <option value="Servicios digitales">Servicios digitales</option>
                <option value="Otro">Otro</option>
              </select>
              {renderCampoError('tipo_emprendimiento')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sector Económico <span className="text-red-500">*</span>
              </label>
              <select
                name="sector_economico"
                value={form.sector_economico}
                onChange={handleChangeSelect}
                className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.sector_economico ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">-- Selecciona --</option>
                <option value="Industrial">Sector Industrial</option>
                <option value="Comercial">Sector Comercial</option>
                <option value="Servicios">Sector de Servicios</option>
              </select>
              {renderCampoError('sector_economico')}
            </div>
          </div>
        )}

        {/* PASO 4: Información Adicional */}
        {paso === 4 && (
          <div className="space-y-5">
            <BodyText className="text-blue-600 mb-4">
              Completa la información final
            </BodyText>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Tienes empresa constituida?
              </label>
              <div className="space-y-2">
                {['Sí', 'No', 'No aplico'].map((opcion) => (
                  <label key={opcion} className="flex items-center">
                    <input
                      type="radio"
                      name="empresa_constituida"
                      value={opcion}
                      checked={form.empresa_constituida === opcion}
                      onChange={handleChangeSelect}
                      className="mr-2"
                    />
                    <span className="text-sm">{opcion}</span>
                  </label>
                ))}
              </div>
            </div>

            {form.empresa_constituida === 'Sí' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIT de la Empresa
                </label>
                <input
                  type="text"
                  name="nit_empresa"
                  value={form.nit_empresa}
                  onChange={handleChangeInput}
                  placeholder="Ej: 900123456"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Hace cuánto tiempo tienes tu emprendimiento?
              </label>
              <select
                name="tiempo_emprendimiento"
                value={form.tiempo_emprendimiento}
                onChange={handleChangeSelect}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0 a 6 meses">0 a 6 meses</option>
                <option value="6 meses a 1 año">6 meses a 1 año</option>
                <option value="1 a 3 años">1 a 3 años</option>
                <option value="Más de 3 años">Más de 3 años</option>
                <option value="No tengo emprendimiento">No tengo emprendimiento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Es emprendimiento familiar?
              </label>
              <div className="space-y-2">
                {['Sí', 'No', 'No aplica'].map((opcion) => (
                  <label key={opcion} className="flex items-center">
                    <input
                      type="radio"
                      name="familiar"
                      value={opcion}
                      checked={form.familiar === opcion}
                      onChange={handleChangeSelect}
                      className="mr-2"
                    />
                    <span className="text-sm">{opcion}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Tienes CVLac?
              </label>
              <div className="space-y-2">
                {['Sí', 'No'].map((opcion) => (
                  <label key={opcion} className="flex items-center">
                    <input
                      type="radio"
                      name="cvlac"
                      value={opcion}
                      checked={form.cvlac === opcion}
                      onChange={handleChangeSelect}
                      className="mr-2"
                    />
                    <span className="text-sm">{opcion}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Tienes RUT?
              </label>
              <div className="space-y-2">
                {['Sí, persona natural', 'Sí, el negocio tiene', 'No'].map((opcion) => (
                  <label key={opcion} className="flex items-center">
                    <input
                      type="radio"
                      name="rut"
                      value={opcion}
                      checked={form.rut === opcion}
                      onChange={handleChangeSelect}
                      className="mr-2"
                    />
                    <span className="text-sm">{opcion}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Redes Sociales del Emprendimiento
              </label>
              <input
                type="text"
                name="redes_sociales"
                value={form.redes_sociales}
                onChange={handleChangeInput}
                placeholder="@nombre_insta | facebook.com/... | linkedin.com/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          {paso > 1 && (
            <ButtonSecondary onClick={handleRetroceder} disabled={loading}>
              ← Atrás
            </ButtonSecondary>
          )}

          {paso < totalPasos && (
            <ButtonPrimary onClick={handleAvanzar} disabled={loading} className="flex-1">
              Siguiente →
            </ButtonPrimary>
          )}

          {paso === totalPasos && (
            <ButtonPrimary onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? 'Enviando...' : 'Enviar Inscripción'}
            </ButtonPrimary>
          )}

          {paso === 1 && (
            <ButtonSecondary onClick={onCancel} disabled={loading}>
              Cancelar
            </ButtonSecondary>
          )}
        </div>
      </form>
    </div>
  )
}