import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearUserProfile } from '../../lib/userProfileStorage'
import DashboardUserShell, { type DashboardUserSection } from './DashboardUserShell'

function seccionDesdePathname(pathname: string): DashboardUserSection {
  if (pathname.includes('/user-dashboard/historial')) return 'actividad'
  if (pathname.includes('/user-dashboard/perfil')) return 'perfil'
  return 'turnos'
}

export default function UserDashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const seccionActiva = useMemo(() => seccionDesdePathname(location.pathname), [location.pathname])

  function aplicarSeccion(section: DashboardUserSection) {
    if (section === 'turnos') navigate('/user-dashboard')
    else if (section === 'actividad') navigate('/user-dashboard/historial')
    else navigate('/user-dashboard/perfil')
  }

  function cerrarSesionYRedirigirAlLogin() {
    clearUserProfile()
    navigate('/login')
  }

  return (
    <DashboardUserShell
      activeSection={seccionActiva}
      onSectionChange={aplicarSeccion}
      onNavigateActividad={() => navigate('/user-dashboard/historial')}
      onLogout={cerrarSesionYRedirigirAlLogin}
    >
      <Outlet />
    </DashboardUserShell>
  )
}
