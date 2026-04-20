import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getUserProfile } from '../lib/userProfileStorage'

type ProtectedRouteProps = {
  allowedRoles?: string[]
}

export default function ProtectedRoute({ allowedRoles = [] }: ProtectedRouteProps) {
  const location = useLocation()
  const profile = getUserProfile()
  const userRole = profile?.rol ?? null

  if (userRole === null) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
