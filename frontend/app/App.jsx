import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Phases from './pages/Phases'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import EmprendimientoDetail from './pages/emprendimientoDetail'
import AdminDashboard from './pages/AdminDashboard'
import AdminEmprendimientoDetail from './pages/AdminEmprendimientoDetail'
import AppLayout from './components/AppLayout'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emprendimiento/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EmprendimientoDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/phases/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Phases />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/emprendimiento/:id"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminEmprendimientoDetail />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
