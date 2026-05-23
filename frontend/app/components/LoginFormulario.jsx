import { useState } from 'react'
import { H3, BodyText } from './Typography'
import { ButtonPrimary, ButtonSecondary } from './Button'
import { login } from '../services/authService'

export default function LoginFormulario({
  onSuccess,
  onCancel,
  recienRegistrado = false,
  loading: loadingExterno = false,
}) {
  const [cedulaUsuario, setCedulaUsuario] = useState('')
  const [cedulaPassword, setCedulaPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [loading, setLoading] = useState(false)

  const validar = () => {
    const nuevos = {}
    if (!cedulaUsuario.trim()) nuevos.usuario = 'Ingresa tu usuario'
    if (!cedulaPassword.trim()) nuevos.password = 'Ingresa tu contraseña'
    setErrors(nuevos)
    return Object.keys(nuevos).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorGeneral(null)
    if (!validar()) return

    setLoading(true)
    try {
      login(cedulaUsuario, cedulaPassword)
      onSuccess?.()
    } catch (err) {
      setErrorGeneral(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (campo) =>
    `w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
      errors[campo] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
    }`

  const enviando = loading || loadingExterno

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm transition-shadow duration-300">
      <div className="mb-6">
        <H3>Iniciar sesión</H3>
        <BodyText className="text-gray-600 mt-2">
          Emprendedores: usa tu cédula en usuario y contraseña. Administrador: usuario{' '}
          <strong>admin</strong> y contraseña <strong>admincontraseña</strong>.
        </BodyText>
      </div>

      {recienRegistrado && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
          <p className="font-semibold mb-1">¡Emprendimiento registrado correctamente!</p>
          <p>
            Ingresa con el número de cédula que registraste en el formulario, en ambos
            campos.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usuario <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cedulaUsuario}
            onChange={(e) => {
              setCedulaUsuario(e.target.value)
              if (errors.usuario) setErrors({ ...errors, usuario: '' })
            }}
            placeholder="Cédula o admin"
            autoComplete="username"
            className={inputClass('usuario')}
          />
          {errors.usuario && <p className="text-red-500 text-sm mt-1">{errors.usuario}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={cedulaPassword}
            onChange={(e) => {
              setCedulaPassword(e.target.value)
              if (errors.password) setErrors({ ...errors, password: '' })
            }}
            placeholder="Cédula o contraseña admin"
            autoComplete="current-password"
            className={inputClass('password')}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {errorGeneral && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorGeneral}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <ButtonPrimary type="submit" disabled={enviando} className="flex-1">
            {enviando ? 'Ingresando...' : 'Iniciar sesión'}
          </ButtonPrimary>
          <ButtonSecondary type="button" onClick={onCancel} disabled={enviando} className="flex-1">
            Cancelar
          </ButtonSecondary>
        </div>
      </form>
    </div>
  )
}
