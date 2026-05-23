import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../services/authService'

export default function AdminProtectedRoute({ children }) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/"
        state={{ openLogin: true, from: location.pathname }}
        replace
      />
    )
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
