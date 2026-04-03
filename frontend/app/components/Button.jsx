/**
 * Componentes de botones reutilizables
 * Proporciona variantes consistentes: primary, secondary, tertiary, danger
 */

export function ButtonPrimary({ children, className = '', ...props }) {
  return (
    <button
      className={`
        bg-blue-600 hover:bg-blue-700 text-white 
        px-6 py-3 rounded-full font-semibold 
        transition-all duration-200 
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonSecondary({ children, className = '', ...props }) {
  return (
    <button
      className={`
        border-2 border-blue-600 text-blue-600 
        bg-transparent hover:bg-blue-50
        px-6 py-3 rounded-full font-semibold 
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonTertiary({ children, className = '', ...props }) {
  return (
    <button
      className={`
        bg-gray-100 text-gray-900 hover:bg-gray-200
        px-6 py-3 rounded-lg font-medium
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonDanger({ children, className = '', ...props }) {
  return (
    <button
      className={`
        bg-red-600 hover:bg-red-700 text-white
        px-6 py-3 rounded-lg font-semibold
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonSmall({ children, className = '', ...props }) {
  return (
    <button
      className={`
        bg-blue-600 hover:bg-blue-700 text-white
        px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}