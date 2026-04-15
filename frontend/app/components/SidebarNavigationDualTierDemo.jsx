import { Link } from 'react-router-dom'

export function SidebarNavigationDualTierDemo({ onItemClick }) {
  const menuItems = [
    { label: 'Inicio', path: '/', icon: '🏠' },
    { label: 'Etapas', path: '/phases', icon: '📋' },
    { label: 'Perfil', path: '/profile', icon: '👤' },
  ]

  return (
    <nav className="h-full flex flex-col p-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white overflow-y-auto">
      {/* Header del menú */}
      <div className="mb-8 pb-6 border-b bg-gradient-to-r from-blue-700 to-blue-900">
        <h2 className="text-lg font-bold">Menú</h2>
        <p className="text-sm text-blue-100">Navega por la plataforma</p>
      </div>

      {/* Items de navegación */}
      <div className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-semibold text-white hover:bg-blue-500 transition-all duration-200 active:bg-blue-700"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Footer del sidebar */}
      <div className="pt-6 border-t border-blue-500">
        <div className="bg-blue-700 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-100 mb-2">¿Necesitas ayuda?</p>
          <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
            Contacto
          </button>
        </div>
      </div>
    </nav>
  )
}