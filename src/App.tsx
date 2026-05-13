import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts y Componentes
import MainLayout from './components/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

// Páginas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'
import CreateTurno from './pages/CreateTurno'
import UserDashboardLayout from './pages/DashboardUser/UserDashboardLayout'
import UserDashboardHistorial from './pages/DashboardUser/UserDashboardHistorial'
import UserDashboardPerfil from './pages/DashboardUser/UserDashboardPerfil'
import UserDashboardTurnos from './pages/DashboardUser/UserDashboardTurnos'
import ResetPasswordUsuario from './pages/DashboardUser/ResetPasswordUsuario'
import AdminDashboard from './pages/AdminDashboard'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminTurnos from './pages/AdminTurnos'
import { ResultPayment } from './pages/ReturnPayment'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* --- Rutas Públicas --- */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- Rutas Protegidas: CLIENTE (User) --- */}
          {/* Solo entra si el rol es exactamente 'user' */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user-dashboard" element={<UserDashboardLayout />}>
              <Route index element={<UserDashboardTurnos />} />
              <Route path="historial" element={<UserDashboardHistorial />} />
              <Route path="perfil" element={<UserDashboardPerfil />} />
            </Route>
            <Route path="/user-dashboard/reset-password" element={<ResetPasswordUsuario />} />
            <Route path="/create-turno" element={<CreateTurno />} />
            <Route path="/return-payment" element={<ResultPayment />} />
          </Route>


          {/* --- Rutas Protegidas: ADMIN --- */}
          {/* Solo entra si el rol es exactamente 'admin' */}
          <Route element={<ProtectedRoute allowedRoles={['barbero' , 'admin'] } />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin-analytics" element={<AdminAnalytics />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin-turnos" element={<AdminTurnos />} />
            <Route path="/admin/turnos" element={<AdminTurnos />} />
          </Route>

          {/* --- Redirección por defecto --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App