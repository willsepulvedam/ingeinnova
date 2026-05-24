import { useState, useEffect } from 'react'
import { SidebarNavigationDualTierDemo } from './SidebarNavigationDualTierDemo'

export default function AppLayout({ children }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isPanelOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isPanelOpen])

  return (
    <>
      <nav className="bg-blue-600 shadow-lg sticky top-0 z-40 animate-fade-in-down">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              type="button"
              onClick={() => setIsPanelOpen(true)}
              className="menu-btn-animated text-white text-2xl font-bold px-3 py-2 rounded-lg hover:bg-blue-500/80"
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <h1 className="text-white text-2xl font-bold tracking-tight">INGEINNOVA</h1>
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
        <div className="flex justify-end items-center absolute top-4 right-4 z-50 md:hidden">
          <button
            type="button"
            onClick={() => setIsPanelOpen(false)}
            className="menu-btn-animated text-white text-3xl leading-none font-bold w-10 h-10 rounded-full hover:bg-white/10"
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>
        <div className={isPanelOpen ? 'h-full animate-slide-in-left' : 'h-full'}>
          <SidebarNavigationDualTierDemo onItemClick={() => setIsPanelOpen(false)} />
        </div>
      </aside>

      <main className="pt-4 animate-page-in">{children}</main>
    </>
  )
}
