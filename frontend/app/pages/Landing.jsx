import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import { registrarUsuariosDesdeInscripcion } from '../services/authService'
import LoginFormulario from '../components/LoginFormulario'
import Modal, { ModalCloseButton } from '../components/Modal'
import { ButtonPrimary, ButtonSecondary } from '../components/Button'
import SuccessAlert from '../components/SuccessAlert'
import { mapFormToPayload } from '../utils/formMapper'

const ETAPAS_PROGRAMA = [
  { orden: 1, nombre: 'Ideación', desc: 'Define y valida tu idea de negocio.' },
  { orden: 2, nombre: 'Validación', desc: 'Prueba tu propuesta con usuarios reales.' },
  { orden: 3, nombre: 'Desarrollo', desc: 'Construye tu producto o servicio mínimo viable.' },
  { orden: 4, nombre: 'Lanzamiento', desc: 'Lleva tu emprendimiento al mercado.' },
]

const BENEFICIOS = [
  { icon: '🚀', titulo: 'Ruta guiada', texto: 'Sigue un camino estructurado de 4 etapas con seguimiento de progreso.' },
  { icon: '🏛️', titulo: 'Universidad Unicolombo', texto: 'Programa de emprendimiento de la Universidad de Colombia.' },
  { icon: '📊', titulo: 'Panel personal', texto: 'Consulta tu perfil y el avance de cada etapa desde un solo lugar.' },
  { icon: '🤝', titulo: 'Acompañamiento', texto: 'Herramientas para potenciar y visibilizar tu proyecto.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showForm, setShowForm] = useState(false)
  const [showLogin, setShowLogin] = useState(location.state?.openLogin ?? false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  
  const initialState = {
    nombre_emprendimiento: '',
    descripcion_emprendimiento: '',
    sector_economico: '',
    tipo_emprendimiento: '',
    redes_sociales: '',
    personas: [
      {
        nombre_completo: '',
        cedula: '',
        correo: '',
        telefono: '',
        sexo: 'Otro',
        barrio: '',
        localidad: '1 Localidad Histórica y del Caribe Norte',
        categoria: 'Estudiante',
        tipo_vinculo: 'Estudiante',
      },
    ],
    edad: '',
    semestre: '',
    programa: '',
    jornada: 'Diurna',
    año_graduacion: '',
    empresa_constituida: 'No',
    nit_empresa: '',
    tiempo_emprendimiento: 'Menos de 1 año',
    tipo_negocio_tipo: 'Producto masivo',
    cantidad_trabajadores: '1-3',
    familiar: 'No',
    empresa_familia: 'No',
    empresa_familia_legal: 'No',
    historial_quiebra: false,
    cvlac: 'No',
    tiene_rut: 'No tiene',
    tipo_cliente_aspirado: '',
    interes_emprender: "Sí", // CAMBIO: String en vez de booleano
  }

  const [formData, setFormData] = useState(initialState)

  const abrirLogin = () => setShowLogin(true)
  const cerrarLogin = () => setShowLogin(false)
  const abrirForm = () => {
    setFormError(null)
    setShowForm(true)
  }
  const cerrarForm = () => {
    setFormError(null)
    setShowForm(false)
  }

  const handleIrALogin = () => {
    setShowSuccess(false)
    abrirLogin()
  }

  const handleLoginExitoso = () => {
    cerrarLogin()
    navigate('/dashboard')
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      // CAMBIO: Los checkboxes devuelven "Sí" o "No" para interes_emprender
      [name]: type === 'checkbox' ? (checked ? "Sí" : "No") : value,
    })
  }

  const handlePersonaChange = (index, field, value) => {
    const newPersonas = [...formData.personas]
    newPersonas[index] = { ...newPersonas[index], [field]: value }
    setFormData({ ...formData, personas: newPersonas })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSaving(true)

    try {
      const payload = mapFormToPayload(formData)
      const nuevaPostulacion = await emprendimientoService.crear(payload)

      registrarUsuariosDesdeInscripcion(
        formData.personas,
        nuevaPostulacion.id,
        nuevaPostulacion.integrantes?.[0]?.id ?? null,
      )

      setShowForm(false)
      setShowSuccess(true)
      setFormData(initialState)
      setCurrentStep(1)
    } catch (err) {
      setFormError(err.message || 'Error al crear el emprendimiento')
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const totalSteps = 6

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <span className="text-white text-2xl font-bold">INGEINNOVA</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={abrirLogin}
              className="text-white/90 hover:text-white text-sm font-medium hidden sm:block"
            >
              Ya tengo cuenta
            </button>
            <ButtonSecondary
              className="!py-2 !px-4 !text-sm !border-white !text-white hover:!bg-white/10"
              onClick={abrirLogin}
            >
              Iniciar sesión
            </ButtonSecondary>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-4">
            Universidad de Colombia — Unicolombo
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Potencia tu emprendimiento con INGEINNOVA
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Plataforma para gestionar, visibilizar y acompañar proyectos de emprendimiento
            de la institución. Inscríbete y recorre la ruta de 4 etapas hacia el lanzamiento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonPrimary
              className="!bg-white !text-blue-700 hover:!bg-blue-50"
              onClick={abrirForm}
            >
              Inscribir mi emprendimiento
            </ButtonPrimary>
            <ButtonSecondary
              className="!border-white !text-white hover:!bg-white/10"
              onClick={() => document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Conocer más
            </ButtonSecondary>
          </div>
        </div>
      </section>

      <section id="sobre-nosotros" className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">¿Qué es INGEINNOVA?</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto text-lg leading-relaxed">
            INGEINNOVA es la plataforma de emprendimiento de Unicolombo. Te permite registrar
            tu proyecto, seguir una ruta estructurada y consultar en todo momento tu perfil
            y el avance por etapas desde tu panel personal.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">¿Por qué participar?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-blue-200 transition-shadow shadow-sm hover:shadow-md">
                <span className="text-3xl mb-3 block">{b.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{b.titulo}</h3>
                <p className="text-sm text-gray-600">{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Ruta de emprendimiento</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Al inscribirte se crea automáticamente tu ruta con cuatro etapas secuenciales.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {ETAPAS_PROGRAMA.map((etapa) => (
              <div key={etapa.orden} className="flex gap-4 bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                  {etapa.orden}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{etapa.nombre}</h3>
                  <p className="text-gray-600 text-sm mt-1">{etapa.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">¿Listo para comenzar?</h2>
          <p className="text-gray-600 mb-8">
            Completa el formulario de inscripción. Al finalizar, inicia sesión con tu
            número de cédula (usuario y contraseña) para acceder a tu panel.
          </p>
          <ButtonPrimary onClick={abrirForm}>
            Abrir formulario de inscripción
          </ButtonPrimary>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>INGEINNOVA © Universidad de Colombia, Unicolombo</p>
      </footer>

      <Modal open={showForm} onClose={cerrarForm} size="lg" panelClassName="bg-gray-50" ariaLabel="Formulario de inscripción">
        <div className="relative p-6 md:p-8">
          <ModalCloseButton onClick={cerrarForm} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscripción</h2>
          <p className="text-gray-600 mb-6">Completa los pasos para registrar tu emprendimiento.</p>
          {formError && (
            <p className="text-red-600 text-sm mt-3 bg-red-50 p-3 rounded-lg">
              Error: {formError}
            </p>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Formulario de inscripción</p>
                  <p className="text-sm text-gray-500">Paso {currentStep} de {totalSteps}</p>
                </div>
                <div className="w-48 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
                </div>
              </div>
            </div>

            {currentStep === 1 && (
              <fieldset className="border-l-4 border-blue-500 pl-4 space-y-4">
                <legend className="text-xl font-semibold text-gray-800 mb-4">Paso 1: Datos del Proyecto</legend>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nombre del Proyecto *</label>
                  <input type="text" name="nombre_emprendimiento" value={formData.nombre_emprendimiento} onChange={handleFormChange} placeholder="Ej: Tech Solutions" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Descripción *</label>
                  <textarea name="descripcion_emprendimiento" value={formData.descripcion_emprendimiento} onChange={handleFormChange} placeholder="Describe tu idea..." required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Sector Económico *</label>
                    <select name="sector_economico" value={formData.sector_economico} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecciona</option>
                      <option value="Tecnología / Software">Tecnología / Software</option>
                      <option value="Gastronomía / Alimentos">Gastronomía / Alimentos</option>
                      <option value="Moda / Textil">Moda / Textil</option>
                      <option value="Artesanías / Diseño">Artesanías / Diseño</option>
                      <option value="Servicios profesionales">Servicios profesionales</option>
                      <option value="Educación / EdTech">Educación / EdTech</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Estado de Madurez *</label>
                    <select name="tipo_emprendimiento" value={formData.tipo_emprendimiento} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecciona</option>
                      <option value="Idea / Proyecto">Idea / Proyecto</option>
                      <option value="Prototipo">Prototipo</option>
                      <option value="En marcha">En marcha</option>
                      <option value="Facturando">Facturando</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Redes Sociales (opcional)</label>
                  <input type="url" name="redes_sociales" value={formData.redes_sociales} onChange={handleFormChange} placeholder="https://instagram.com/..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </fieldset>
            )}

            {currentStep === 2 && (
              <fieldset className="border-l-4 border-green-500 pl-4 space-y-4">
                <legend className="text-xl font-semibold text-gray-800 mb-4">Paso 2: Información del Emprendedor</legend>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nombre Completo *</label>
                  <input type="text" value={formData.personas[0].nombre_completo} onChange={(e) => handlePersonaChange(0, 'nombre_completo', e.target.value)} placeholder="Tu nombre" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Cédula *</label>
                    <input type="text" value={formData.personas[0].cedula} onChange={(e) => handlePersonaChange(0, 'cedula', e.target.value)} placeholder="1234567890" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Edad *</label>
                    <input type="number" name="edad" value={formData.edad} onChange={handleFormChange} placeholder="25" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Institucional *</label>
                  <input 
                    type="email" 
                    value={formData.personas[0].correo} 
                    onChange={(e) => handlePersonaChange(0, 'correo', e.target.value)} 
                    placeholder="tu.correo@unicolombo.edu.co" 
                    required 
                    pattern="^[a-zA-Z0-9._%+-]+@unicolombo\.edu\.co$"
                    title="Debes usar tu correo institucional terminado en @unicolombo.edu.co"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                  <p className="text-xs text-red-600 mt-1 font-semibold">Obligatorio: Debe terminar en @unicolombo.edu.co</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Teléfono *</label>
                  <input 
                    type="tel" 
                    value={formData.personas[0].telefono} 
                    onChange={(e) => handlePersonaChange(0, 'telefono', e.target.value)} 
                    placeholder="+573001234567" 
                    required 
                    pattern="^\+[0-9]{10,15}$"
                    title="Ingresa tu número con código de país, sin espacios ni letras. Ej: +573001234567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                  <p className="text-xs text-red-600 mt-1 font-semibold">Formato: Código de país + número (Sin espacios). Ej: +573001234567</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Sexo</label>
                    <select value={formData.personas[0].sexo} onChange={(e) => handlePersonaChange(0, 'sexo', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Barrio</label>
                    <input type="text" value={formData.personas[0].barrio} onChange={(e) => handlePersonaChange(0, 'barrio', e.target.value)} placeholder="Ej: Bocagrande" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Categoría</label>
                    <select value={formData.personas[0].categoria} onChange={(e) => handlePersonaChange(0, 'categoria', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="Estudiante">Estudiante</option>
                      <option value="Egresado">Egresado</option>
                      <option value="Administrativo">Administrativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Tipo de Vínculo</label>
                    <select value={formData.personas[0].tipo_vinculo} onChange={(e) => handlePersonaChange(0, 'tipo_vinculo', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="Estudiante">Estudiante</option>
                      <option value="Egresado">Egresado</option>
                      <option value="Administrativo">Administrativo</option>
                    </select>
                  </div>
                </div>
              </fieldset>
            )}

            {currentStep === 3 && (
              <fieldset className="border-l-4 border-purple-500 pl-4 space-y-4">
                <legend className="text-2xl font-semibold text-gray-800 mb-4">Paso 3: Información Académica</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Semestre *</label>
                    <select name="semestre" value={formData.semestre} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">Selecciona</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sem) => (
                        <option key={sem} value={sem}>Semestre {sem}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Programa *</label>
                    <select name="programa" value={formData.programa} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">Selecciona</option>
                      <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                      <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                      <option value="Derecho">Derecho</option>
                      <option value="Administración de empresas turísticas y hoteleras">Administración de empresas turísticas y hoteleras</option>
                      <option value="Licenciatura en Bilingüismo con énfasis en Inglés">Licenciatura en Bilingüismo con énfasis en Inglés</option>
                      <option value="Contaduría Pública">Contaduría Pública</option>
                      <option value="Administración de Empresas">Administración de Empresas</option>
                      <option value="Especialización gestión integral de eventos">Especialización gestión integral de eventos</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Jornada</label>
                    <select name="jornada" value={formData.jornada} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="Diurna">Diurna</option>
                      <option value="Nocturna">Nocturna</option>
                      <option value="Mixta">Mixta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Año de Graduación</label>
                    <input type="number" name="año_graduacion" value={formData.año_graduacion} onChange={handleFormChange} placeholder="2025" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
              </fieldset>
            )}

            {currentStep === 4 && (
              <fieldset className="border-l-4 border-orange-500 pl-4 space-y-4">
                <legend className="text-2xl font-semibold text-gray-800 mb-4">Paso 4: Detalles del Emprendimiento</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">¿Está constituida legalmente?</label>
                    <select name="empresa_constituida" value={formData.empresa_constituida} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">NIT (si aplica)</label>
                    <input type="text" name="nit_empresa" value={formData.nit_empresa} onChange={handleFormChange} placeholder="XXXXXXXXX" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Tiempo de Existencia</label>
                    <select name="tiempo_emprendimiento" value={formData.tiempo_emprendimiento} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="Menos de 1 año">Menos de 1 año</option>
                      <option value="1-2 años">1-2 años</option>
                      <option value="2-5 años">2-5 años</option>
                      <option value="Más de 5 años">Más de 5 años</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Tipo de Negocio</label>
                    <select name="tipo_negocio_tipo" value={formData.tipo_negocio_tipo} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="Producto masivo">Producto masivo</option>
                      <option value="Producto de nicho">Producto de nicho</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Plataforma digital / Tecnológico">Plataforma digital / Tecnológico</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Cantidad de Trabajadores</label>
                    <select name="cantidad_trabajadores" value={formData.cantidad_trabajadores} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="1-3">1-3</option>
                      <option value="4-10">4-10</option>
                      <option value="11-20">11-20</option>
                      <option value="21+">21+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">¿Es familiar?</label>
                    <select name="familiar" value={formData.familiar} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">¿Familia tiene empresa?</label>
                    <select name="empresa_familia" value={formData.empresa_familia} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">¿Empresa familiar legal?</label>
                    <select name="empresa_familia_legal" value={formData.empresa_familia_legal} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">¿Tiene RUT?</label>
                    <select name="tiene_rut" value={formData.tiene_rut} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="No tiene">No tiene</option>
                      <option value="En trámite">En trámite</option>
                      <option value="Sí tiene">Sí tiene</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">¿Tiene CVLAC?</label>
                    <select name="cvlac" value={formData.cvlac} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" name="historial_quiebra" checked={formData.historial_quiebra} onChange={handleFormChange} className="mr-3 w-4 h-4" />
                    <span className="text-gray-700">¿Tiene historial de quiebra?</span>
                  </label>
                </div>
              </fieldset>
            )}

            {currentStep === 5 && (
              <fieldset className="border-l-4 border-red-500 pl-4 space-y-4">
                <legend className="text-xl font-semibold text-gray-800 mb-4">Paso 5: Cliente Objetivo</legend>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tipo de Cliente Aspirado *</label>
                  <select name="tipo_cliente_aspirado" value={formData.tipo_cliente_aspirado} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Selecciona</option>
                    <option value="B2C - Consumidor Final (Personas)">B2C - Consumidor Final (Personas)</option>
                    <option value="B2B - Empresas / Corporativos">B2B - Empresas / Corporativos</option>
                    <option value="B2G - Gobierno / Entidades Públicas">B2G - Gobierno / Entidades Públicas</option>
                    <option value="B2B2C - Alianzas comerciales para llegar al usuario">B2B2C - Alianzas comerciales para llegar al usuario</option>
                  </select>
                </div>
                <p className="text-gray-600 text-sm">
                  B2C: Productos/servicios para consumidores individuales<br />
                  B2B: Productos/servicios para otras empresas<br />
                  B2G: Productos/servicios para entidades gubernamentales
                </p>
              </fieldset>
            )}

            {currentStep === 6 && (
              <fieldset className="border-l-4 border-pink-500 pl-4 space-y-4">
                <legend className="text-xl font-semibold text-gray-800 mb-4">Paso 6: Resumen y Confirmación</legend>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-gray-800">Verifica tus datos:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Proyecto:</p>
                      <p className="font-medium">{formData.nombre_emprendimiento}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Nombre:</p>
                      <p className="font-medium">{formData.personas[0].nombre_completo}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cédula:</p>
                      <p className="font-medium">{formData.personas[0].cedula}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-medium">{formData.personas[0].correo}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Sector:</p>
                      <p className="font-medium">{formData.sector_economico}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estado:</p>
                      <p className="font-medium">{formData.tipo_emprendimiento}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 pt-4 border-t">🔑 La contraseña inicial será tu cédula</p>
                </div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="interes_emprender" 
                    checked={formData.interes_emprender === "Sí"} // CAMBIO: Comparamos con String
                    onChange={handleFormChange} 
                    className="mr-3 w-4 h-4" 
                    required 
                  />
                  <span className="text-gray-700">Confirmo que todos mis datos son correctos y acepto los términos</span>
                </label>
              </fieldset>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition">← Anterior</button>
              )}
              {currentStep < 6 && (
                <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">Siguiente →</button>
              )}
              {currentStep === 6 && (
                <button type="submit" disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition">
                  {saving ? 'Enviando...' : '✓ Crear Emprendimiento'}
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={showLogin} onClose={cerrarLogin} size="sm" panelClassName="bg-gray-50" ariaLabel="Iniciar sesión">
        <div className="relative p-6 md:p-8">
          <ModalCloseButton onClick={cerrarLogin} />
          <LoginFormulario onSuccess={handleLoginExitoso} onCancel={cerrarLogin} />
        </div>
      </Modal>

      {showSuccess && <SuccessAlert onIrALogin={handleIrALogin} />}
    </div>
  )
}