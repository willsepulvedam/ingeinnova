import { Link } from 'react-router-dom'

export function SidebarNavigationDualTierDemo({ onItemClick }) {

  return (
    <div className="h-full flex flex-col p-4 bg-white text-gray-900">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Menú</h2>
        <p className="text-sm text-gray-500">Selecciona una opción</p>
      </div>

      <div className="flex-1">
        <Link
          to="/"
          onClick={onItemClick}
          className="block px-3 py-2 rounded hover:bg-gray-100 transition font-semibold"
        >
          Inicio
        </Link>
        <Link
          to="/phases"
          onClick={onItemClick}
          className="block px-3 py-2 mt-2 rounded hover:bg-gray-100 transition font-semibold"
        >
          Fases
        </Link>
        <Link
          to="/profile"
          onClick={onItemClick}
          className="block px-3 py-2 mt-2 rounded hover:bg-gray-100 transition font-semibold"
        >
          Perfil
        </Link>
      </div>
    </div>
  )
}
