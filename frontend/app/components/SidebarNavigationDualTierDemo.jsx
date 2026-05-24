import { Link, useNavigate } from 'react-router-dom'
import { logout, getSession } from '../services/authService'

export function SidebarNavigationDualTierDemo({ onItemClick }) {
  const navigate = useNavigate()
  const session = getSession()

  const menuItems = [
    { label: 'Mi panel', path: '/dashboard', icon: '🏠' },
    { label: 'Perfil', path: '/profile', icon: '👤' },
  ]

  const handleLogout = () => {
    logout()
    onItemClick?.()
    navigate('/', { state: { openLogin: true } })
  }

  return (
    <nav className="h-full flex flex-col p-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white overflow-y-auto">
      <div className="mb-8 pb-6 border-b bg-gradient-to-r from-blue-700 to-blue-900">
        <h2 className="text-lg font-bold">Menú</h2>
        {session?.nombre ? (
          <p className="text-sm text-blue-100 mt-1 truncate">Hola, {session.nombre.split(' ')[0]}</p>
        ) : (
          <p className="text-sm text-blue-100">Navega por la plataforma</p>
        )}
      </div>

      <div className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className="nav-link-animated flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-semibold text-white hover:bg-blue-500/90 active:scale-[0.98]"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="pt-6 border-t border-blue-500 space-y-3">
        <button
          type="button"
          onClick={handleLogout}
          className="btn-interactive w-full bg-blue-800 text-white font-semibold py-2 rounded-lg hover:bg-blue-950"
        >
          Cerrar sesión
        </button>
        <div className="bg-blue-700 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-100 mb-2">¿Necesitas ayuda?</p>
          <button
            type="button"
            className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Contacto
          </button>
        </div>
      </div>
    </nav>
  )
}
