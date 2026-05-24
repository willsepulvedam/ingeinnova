/**
 * Componentes de tipografía reutilizables
 * Proporciona escala consistente de texto
 */

export function H1({ children, className = '' }) {
  return (
    <h1 className={`text-5xl md:text-6xl font-bold text-gray-900 leading-tight ${className}`}>
      {children}
    </h1>
  )
}

export function H2({ children, className = '' }) {
  return (
    <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 leading-tight ${className}`}>
      {children}
    </h2>
  )
}

export function H3({ children, className = '' }) {
  return (
    <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 ${className}`}>
      {children}
    </h3>
  )
}

export function H4({ children, className = '' }) {
  return (
    <h4 className={`text-xl md:text-2xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h4>
  )
}

export function Subtitle({ children, className = '' }) {
  return (
    <p className={`text-xl text-gray-600 leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

export function BodyText({ children, className = '' }) {
  return (
    <p className={`text-base text-gray-700 leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

export function SmallText({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  )
}

export function TextMuted({ children, className = '' }) {
  return (
    <p className={`text-gray-500 text-sm ${className}`}>
      {children}
    </p>
  )
}