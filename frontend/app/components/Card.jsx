/**
 * Componentes de tarjeta reutilizables
 * Proporciona diferentes estilos y variantes
 */

export function Card({ children, className = '' }) {
  return (
    <div className={`card-hover bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  )
}

export function CardHighlight({ children, className = '' }) {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className}`}>
      {children}
    </div>
  )
}

export function CardSection({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

// Componente que combina header, body y footer
export function FullCard({ header, body, footer, className = '' }) {
  return (
    <Card className={className}>
      {header && <CardHeader>{header}</CardHeader>}
      {body && <CardBody>{body}</CardBody>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}