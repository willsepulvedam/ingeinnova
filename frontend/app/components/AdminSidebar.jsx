import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

export function AdminSidebar({ onItemClick }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onItemClick?.()
    navigate('/', { state: { openLogin: true } })
  }

  return (
    <nav className="h-full flex flex-col p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-y-auto">
      <div className="mb-8 pb-6 border-b border-slate-600">
        <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Panel</p>
        <h2 className="text-lg font-bold">Administración</h2>
        <p className="text-sm text-slate-300 mt-1">INGEINNOVA</p>
      </div>

      <div className="flex-1 space-y-2">
        <Link
          to="/admin"
          onClick={onItemClick}
          className="nav-link-animated flex items-center gap-3 px-4 py-3 rounded-lg font-semibold hover:bg-slate-700 active:scale-[0.98]"
        >
          <span className="text-xl">📊</span>
          <span>Emprendimientos</span>
        </Link>
      </div>

      <div className="pt-6 border-t border-slate-600">
        <button
          type="button"
          onClick={handleLogout}
          className="btn-interactive w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
