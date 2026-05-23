const BTN_BASE =
  'btn-interactive inline-flex items-center justify-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none'

export function ButtonPrimary({ children, className = '', ...props }) {
  return (
    <button
      className={`
        ${BTN_BASE}
        bg-blue-600 hover:bg-blue-700 text-white
        px-6 py-3 rounded-full
        shadow-md shadow-blue-600/20
        hover:shadow-lg hover:shadow-blue-600/30
        focus-visible:ring-blue-500
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
        ${BTN_BASE}
        border-2 border-blue-600 text-blue-600
        bg-transparent hover:bg-blue-50
        px-6 py-3 rounded-full
        hover:shadow-md hover:shadow-blue-500/10
        focus-visible:ring-blue-500
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
        ${BTN_BASE}
        bg-gray-100 text-gray-900 hover:bg-gray-200
        px-6 py-3 rounded-lg
        focus-visible:ring-gray-400
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
        ${BTN_BASE}
        bg-red-600 hover:bg-red-700 text-white
        px-6 py-3 rounded-lg
        shadow-md shadow-red-600/20
        hover:shadow-lg hover:shadow-red-600/25
        focus-visible:ring-red-500
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
        ${BTN_BASE}
        bg-blue-600 hover:bg-blue-700 text-white
        px-4 py-2 rounded-lg text-sm font-medium
        shadow-sm shadow-blue-600/15
        hover:shadow-md
        focus-visible:ring-blue-500
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
