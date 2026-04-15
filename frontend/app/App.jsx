import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Phases from './pages/Phases'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import EmprendimientoDetail from './pages/emprendimientoDetail'
import { SidebarNavigationDualTierDemo } from './components/SidebarNavigationDualTierDemo'

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isPanelOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isPanelOpen])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Navbar */}
        <nav className="bg-blue-600 shadow-lg sticky top-0 z-40">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setIsPanelOpen(true)}
                className="text-white text-2xl font-bold px-3 py-2 rounded hover:bg-blue-500 transition-colors duration-200"
                aria-label="Abrir menú"
              >
                ☰
              </button>
              <h1 className="text-white text-2xl font-bold">INGEINNOVA</h1>
              <div className="w-12" />
            </div>
          </div>
        </nav>

        {/* Overlay del sidebar */}
        {isPanelOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-200"
            onClick={() => setIsPanelOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-80 z-40 transition-transform duration-300 ease-in-out ${
            isPanelOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center absolute top-4 right-4 z-50 md:hidden">
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-white text-3xl leading-none font-bold hover:text-gray-200 transition"
              aria-label="Cerrar menú"
            >
              ×
            </button>
          </div>
          <SidebarNavigationDualTierDemo onItemClick={() => setIsPanelOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Ruta dinámica para detalle de emprendimiento (etapas + progreso) */}
            <Route path="/emprendimiento/:id" element={<EmprendimientoDetail />} />
            <Route path="/phases" element={<Phases />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App