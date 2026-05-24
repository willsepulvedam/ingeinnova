import { Link } from 'react-router-dom'
import { H1, Subtitle } from '../components/Typography'
import { ButtonPrimary } from '../components/Button'

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Número 404 grande y decorativo */}
        <div className="mb-8">
          <div className="text-9xl md:text-[150px] font-black text-blue-200 leading-none">
            404
          </div>
        </div>

        {/* Título */}
        <H1 className="mb-4">Página no encontrada</H1>

        {/* Descripción */}
        <Subtitle className="mb-8 text-gray-600">
          Lo sentimos, la página que buscas no existe. Pero no te preocupes, 
          aquí en Ingeinnova siempre hay oportunidades para emprender.
        </Subtitle>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <ButtonPrimary>Volver al inicio</ButtonPrimary>
          </Link>
          <Link to="/phases">
            <ButtonPrimary className="bg-orange-500 hover:bg-orange-600">
              Ver fases
            </ButtonPrimary>
          </Link>
        </div>

        {/* Decoración con emojis */}
        <div className="mt-12 text-6xl animate-bounce">
          🚀
        </div>
      </div>
    </div>
  )
}

export default NotFound