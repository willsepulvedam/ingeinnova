import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { emprendimientoService } from '../services/EmprendimientoService'
import FormularioEmprendimiento from '../components/Formularioemprendimiento'
import LoginFormulario from '../components/LoginFormulario'
import SuccessAlert from '../components/SuccessAlert'
import Modal, { ModalCloseButton } from '../components/Modal'
import { ButtonPrimary, ButtonSecondary } from '../components/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { getPropietarioId } from '../utils/propietario'
import { registrarUsuariosDesdeInscripcion, isAdmin } from '../services/authService'

const ETAPAS_PROGRAMA = [
  { orden: 1, nombre: 'Ideación', desc: 'Define y valida tu idea de negocio.' },
  { orden: 2, nombre: 'Validación', desc: 'Prueba tu propuesta con usuarios reales.' },
  { orden: 3, nombre: 'Desarrollo', desc: 'Construye tu producto o servicio mínimo viable.' },
  { orden: 4, nombre: 'Lanzamiento', desc: 'Lleva tu emprendimiento al mercado.' },
]

const BENEFICIOS = [
  { icon: '🎯', titulo: 'Ruta guiada', texto: 'Sigue un camino estructurado de 4 etapas con seguimiento de progreso.' },
  { icon: '🏛️', titulo: 'Universidad Unicolombo', texto: 'Programa de emprendimiento de la Universidad de Colombia.' },
  { icon: '📊', titulo: 'Panel personal', texto: 'Consulta tu perfil y el avance de cada etapa desde un solo lugar.' },
  { icon: '🚀', titulo: 'Acompañamiento', texto: 'Herramientas para potenciar y visibilizar tu proyecto.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showForm, setShowForm] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginRecienRegistrado, setLoginRecienRegistrado] = useState(false)
  const [loginDestino, setLoginDestino] = useState('/dashboard')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const abrirLogin = (opts = {}) => {
    setLoginRecienRegistrado(opts.recienRegistrado ?? false)
    if (opts.destino) setLoginDestino(opts.destino)
    setShowLogin(true)
  }

  const cerrarLogin = () => {
    setShowLogin(false)
    setLoginRecienRegistrado(false)
  }

  useEffect(() => {
    if (location.state?.openLogin) {
      abrirLogin({
        recienRegistrado: location.state.registrado === true,
        destino: location.state.from || '/dashboard',
      })
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  useScrollReveal([showForm, showLogin, showSuccess])

  useEffect(() => {
    const bloquear = showForm || showLogin || showSuccess
    document.body.style.overflow = bloquear ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showForm, showLogin, showSuccess])

  const handleSubmitForm = async (formData) => {
    setSaving(true)
    setFormError(null)
    try {
      const propietarioId = getPropietarioId()
      const emprendimiento = await emprendimientoService.crear({
        nombre: formData.nombre_emprendimiento.trim(),
        descripcion: formData.descripcion_emprendimiento.trim(),
        propietario_id: propietarioId,
      })

      if (formData.personas?.length) {
        registrarUsuariosDesdeInscripcion(
          formData.personas,
          emprendimiento.id,
          propietarioId
        )
      }

      setShowForm(false)
      setShowSuccess(true)
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleIrALogin = () => {
    setShowSuccess(false)
    abrirLogin({ recienRegistrado: true })
  }

  const handleLoginExitoso = () => {
    cerrarLogin()
    if (isAdmin()) {
      navigate('/admin', { replace: true })
    } else {
      navigate(loginDestino, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header landing */}
      <header className="bg-blue-600 shadow-lg sticky top-0 z-30 animate-fade-in-down">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <span className="text-white text-2xl font-bold">INGEINNOVA</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => abrirLogin()}
              className="text-white/90 hover:text-white text-sm font-medium hidden sm:block"
            >
              Ya tengo cuenta
            </button>
            <ButtonSecondary
              className="!py-2 !px-4 !text-sm !border-white !text-white hover:!bg-white/10"
              onClick={() => abrirLogin()}
            >
              Iniciar sesión
            </ButtonSecondary>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center animate-fade-in-up">
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
              onClick={() => setShowForm(true)}
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

      {/* Sobre nosotros */}
      <section id="sobre-nosotros" className="py-16 md:py-20 reveal-on-scroll">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">¿Qué es INGEINNOVA?</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto text-lg leading-relaxed">
            INGEINNOVA es la plataforma de emprendimiento de Unicolombo. Te permite registrar
            tu proyecto, seguir una ruta estructurada y consultar en todo momento tu perfil
            y el avance por etapas desde tu panel personal.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-12 bg-white border-y border-gray-100 reveal-on-scroll">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">¿Por qué participar?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFICIOS.map((b, i) => (
              <div
                key={b.titulo}
                className={`card-hover bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-blue-200 reveal-on-scroll stagger-${i + 1}`}
              >
                <span className="text-3xl mb-3 block">{b.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{b.titulo}</h3>
                <p className="text-sm text-gray-600">{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Etapas del programa */}
      <section className="py-16 md:py-20 reveal-on-scroll">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Ruta de emprendimiento</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Al inscribirte se crea automáticamente tu ruta con cuatro etapas secuenciales.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {ETAPAS_PROGRAMA.map((etapa, i) => (
              <div
                key={etapa.orden}
                className={`card-hover flex gap-4 bg-white rounded-xl p-6 border border-gray-200 shadow-sm reveal-on-scroll stagger-${i + 1}`}
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg transition-transform duration-300 group-hover:scale-110">
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

      {/* CTA inscripción */}
      <section className="py-16 bg-blue-50 reveal-on-scroll">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-gray-600 mb-8">
            Completa el formulario de inscripción. Al finalizar, inicia sesión con tu
            número de cédula (usuario y contraseña) para acceder a tu panel.
          </p>
          <ButtonPrimary onClick={() => setShowForm(true)}>
            Abrir formulario de inscripción
          </ButtonPrimary>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>INGEINNOVA — Universidad de Colombia, Unicolombo</p>
      </footer>

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false)
          setFormError(null)
        }}
        size="lg"
        panelClassName="bg-gray-50"
        ariaLabel="Formulario de inscripción"
      >
        <div className="relative p-6 md:p-8">
          <ModalCloseButton
            onClick={() => {
              setShowForm(false)
              setFormError(null)
            }}
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-12 animate-fade-in">Inscripción</h2>
          <p className="text-gray-600 mb-6">Completa los pasos para registrar tu emprendimiento.</p>
          <FormularioEmprendimiento
            onSubmit={handleSubmitForm}
            onCancel={() => {
              setShowForm(false)
              setFormError(null)
            }}
            loading={saving}
          />
          {formError && (
            <p className="text-red-600 text-sm mt-3 bg-red-50 p-3 rounded-lg animate-fade-in">
              Error: {formError}
            </p>
          )}
        </div>
      </Modal>

      <Modal
        open={showLogin}
        onClose={cerrarLogin}
        size="sm"
        panelClassName="bg-gray-50"
        ariaLabel="Iniciar sesión"
      >
        <div className="relative p-6 md:p-8">
          <ModalCloseButton onClick={cerrarLogin} />
          <LoginFormulario
            recienRegistrado={loginRecienRegistrado}
            onSuccess={handleLoginExitoso}
            onCancel={cerrarLogin}
          />
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿Aún no te has inscrito?{' '}
            <button
              type="button"
              onClick={() => {
                cerrarLogin()
                setShowForm(true)
              }}
              className="text-blue-600 font-medium hover:underline transition-colors"
            >
              Registra tu emprendimiento
            </button>
          </p>
        </div>
      </Modal>

      {showSuccess && <SuccessAlert onIrALogin={handleIrALogin} />}
    </div>
  )
}
