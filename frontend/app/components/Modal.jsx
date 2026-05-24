import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const SIZE_CLASS = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  children,
  size = 'lg',
  zIndex = 9999,
  align = 'start',
  ariaLabel = 'Ventana modal',
  panelClassName = 'bg-white',
}) {
  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const alignItems = align === 'center' ? 'items-center' : 'items-start'

  return createPortal(
    <div
      className={`fixed inset-0 flex justify-center p-4 overflow-y-auto modal-scroll ${alignItems}`}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-black/50 animate-fade-in backdrop-blur-[2px]"
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full my-8 ${SIZE_CLASS[size] ?? SIZE_CLASS.lg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`${panelClassName} rounded-2xl shadow-2xl w-full animate-scale-in ring-1 ring-gray-200/80 overflow-hidden`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export function ModalCloseButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:scale-110 active:scale-95 font-bold text-xl leading-none transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
      aria-label="Cerrar"
    >
      ×
    </button>
  )
}
