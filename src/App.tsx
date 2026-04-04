import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import CreateTurno from './pages/CreateTurno'
import DashboardsUser from './pages/DashboardsUser'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import Contact from './pages/Contact'

function App() {
  // Aquí deberías obtener el rol de tu estado global o localStorage
  // Por ahora lo simulamos:
  const rol = 'user'

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas Protegidas para USUARIOS (Cualquier logueado) */}
          <Route element={<ProtectedRoute userRole={rol} allowedRoles={['user', 'admin']} />}>
            <Route path="/user-dashboard" element={<DashboardsUser />} />
            <Route path="/create-turno" element={<CreateTurno />} />
          </Route>

          {/* Rutas Protegidas solo para ADMINS */}
          <Route>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
