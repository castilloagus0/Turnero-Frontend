import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearUserProfile } from '../../lib/userProfileStorage'
import AdminDashboardShell from './AdminDashboardShell'

// Resuelve el prefijo de URL del panel para que los enlaces funcionen en /admin-dashboard y /admin/dashboard.
function resolverBasePathAdmin(pathname: string): string {
  if (pathname.startsWith('/admin/dashboard')) return '/admin/dashboard'
  return '/admin-dashboard'
}

export default function AdminDashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  const basePath = useMemo(() => resolverBasePathAdmin(location.pathname), [location.pathname])

  function cerrarSesionYRedirigirAlLogin() {
    clearUserProfile()
    navigate('/login')
  }

  return (
    <AdminDashboardShell
      basePath={basePath}
      navOpen={navOpen}
      onNavOpenChange={setNavOpen}
      onLogout={cerrarSesionYRedirigirAlLogin}
    >
      <div className="flex flex-1 flex-col overflow-auto bg-neutral-100/80">
        <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </div>
    </AdminDashboardShell>
  )
}
