import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../services/authService'

/** Redirige al inicio y abre el modal de login (compatibilidad con /login). */
export default function Login() {
  const location = useLocation()
  const destino = isAdmin()
    ? '/admin'
    : location.state?.from || '/dashboard'

  if (isAuthenticated()) {
    return <Navigate to={destino} replace />
  }

  return (
    <Navigate
      to="/"
      replace
      state={{
        openLogin: true,
        registrado: location.state?.registrado === true,
        from: destino,
      }}
    />
  )
}
