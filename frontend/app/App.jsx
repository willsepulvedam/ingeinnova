import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Phases from './pages/Phases'
import Profile from './pages/Profile'
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
      <div className="min-h-screen bg-gray-100 overflow-x-hidden">
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <button
              onClick={() => setIsPanelOpen(true)}
              className="text-white text-xl font-bold px-3 py-2 rounded hover:bg-blue-500 transition"
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <h1 className="text-white text-xl font-bold">Ingeinnova</h1>
          </div>
        </nav>

        {isPanelOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsPanelOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 w-80 z-50 transition-transform duration-300 ${
            isPanelOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full bg-blue-600 text-white">
            <div className="flex justify-between items-center p-4 border-b border-blue-500">
              <h2 className="text-2xl font-bold">Ingeinnova</h2>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="text-white text-2xl leading-none"
                aria-label="Cerrar menú"
              >
                ×
              </button>
            </div>
            <SidebarNavigationDualTierDemo onItemClick={() => setIsPanelOpen(false)} />
          </div>
        </aside>

        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phases" element={<Phases />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App