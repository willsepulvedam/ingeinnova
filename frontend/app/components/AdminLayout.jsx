import { useState, useEffect } from 'react'
import { AdminSidebar } from './AdminSidebar'

export default function AdminLayout({ children }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isPanelOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isPanelOpen])

  return (
    <>
      <nav className="bg-slate-800 shadow-lg sticky top-0 z-40 animate-fade-in-down">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              type="button"
              onClick={() => setIsPanelOpen(true)}
              className="menu-btn-animated text-white text-2xl font-bold px-3 py-2 rounded-lg hover:bg-slate-700"
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <div className="text-center">
              <h1 className="text-white text-xl font-bold tracking-tight">INGEINNOVA Admin</h1>
              <p className="text-slate-400 text-xs">Gestión de emprendimientos</p>
            </div>
            <div className="w-12" />
          </div>
        </div>
      </nav>

      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 animate-fade-in backdrop-blur-sm"
          onClick={() => setIsPanelOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-80 z-40 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsPanelOpen(false)}
          className="absolute top-4 right-4 z-50 menu-btn-animated text-white text-3xl font-bold md:hidden"
          aria-label="Cerrar menú"
        >
          ×
        </button>
        <div className={isPanelOpen ? 'h-full animate-slide-in-left' : 'h-full'}>
          <AdminSidebar onItemClick={() => setIsPanelOpen(false)} />
        </div>
      </aside>

      <main className="pt-4 animate-page-in">{children}</main>
    </>
  )
}
