import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { H1, H2, H3, Subtitle, BodyText } from '../components/Typography'
import { ButtonPrimary, ButtonSecondary } from '../components/Button'
import { Card, CardBody } from '../components/Card'
import { etapaService } from '../services/EtapaService'
import { rutaService } from '../services/RutaService'

function Phases() {
  const { id } = useParams()
  const [etapas, setEtapas] = useState([])
  const [rutaAsociada, setRutaAsociada] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    fetchRouteData()
  }, [id])

  const fetchRouteData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [etapasData, rutaData] = await Promise.all([
        etapaService.listarPorEmprendimiento(id),
        rutaService.obtenerPorEmprendimiento(id),
      ])
      setEtapas(etapasData)
      setRutaAsociada(rutaData)
    } catch (fetchError) {
      console.error('Error al cargar la ruta:', fetchError)
      setError('No se pudo cargar la ruta o las etapas. Verifica el emprendimiento.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompletar = async (etapaId) => {
    try {
      await etapaService.completar(etapaId)
      fetchRouteData()
    } catch (fetchError) {
      console.error('Error al completar etapa:', fetchError)
    }
  }

  const handleAvanzarRuta = async () => {
    if (!rutaAsociada) return
    try {
      await rutaService.avanzar(rutaAsociada.id)
      fetchRouteData()
    } catch (fetchError) {
      console.error('Error al avanzar ruta:', fetchError)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Cargando información de la ruta...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <H1>Administrar Etapas</H1>
          <Subtitle>Visualiza y actualiza las etapas de este emprendimiento. Cada etapa está asociada a una ruta.</Subtitle>
        </div>
        <Link to="/">
          <ButtonSecondary>Volver al panel</ButtonSecondary>
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {rutaAsociada && (
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
              <div>
                <H2 className="mb-2">Ruta asociada</H2>
                <BodyText>ID de ruta: {rutaAsociada.id}</BodyText>
                <BodyText>Estado actual: {rutaAsociada.etapa_actual}</BodyText>
                <BodyText>Fecha inicio: {new Date(rutaAsociada.fecha_inicio).toLocaleDateString()}</BodyText>
              </div>
              <ButtonPrimary onClick={handleAvanzarRuta}>Avanzar ruta</ButtonPrimary>
            </div>
          </CardBody>
        </Card>
      )}

      {etapas.length === 0 ? (
        <Card>
          <CardBody>
            <BodyText>No se encontraron etapas para este emprendimiento.</BodyText>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6">
          {etapas.map((etapa) => (
            <Card key={etapa.id}>
              <CardBody>
                <div className="flex flex-col gap-4">
                  <div>
                    <H3 className="mb-2">{etapa.nombre}</H3>
                    <BodyText className="text-gray-700 mb-2">{etapa.descripcion}</BodyText>
                    <BodyText className="text-sm text-gray-500">Orden: {etapa.orden}</BodyText>
                    <BodyText className="text-sm text-gray-500">Estado: {etapa.estado}</BodyText>
                    <BodyText className="text-sm text-gray-500">Ruta asociada: {etapa.ruta_id}</BodyText>
                    {etapa.fecha_completada && (
                      <BodyText className="text-sm text-gray-500">Completada: {new Date(etapa.fecha_completada).toLocaleDateString()}</BodyText>
                    )}
                  </div>
                  {etapa.estado === 'EN_PROGRESO' && (
                    <ButtonPrimary onClick={() => handleCompletar(etapa.id)}>
                      Completar etapa
                    </ButtonPrimary>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Phases