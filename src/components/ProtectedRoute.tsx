import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getUserProfile } from '../lib/userProfileStorage'

type ProtectedRouteProps = {
  allowedRoles?: string[]
}

export default function ProtectedRoute({ allowedRoles = [] }: ProtectedRouteProps) {
  const location = useLocation()
  const profile = getUserProfile()
  const userRole = String(profile?.rol ?? '').trim().toLowerCase()
  const normalizedAllowedRoles = allowedRoles.map((role) => String(role).trim().toLowerCase())

  if (!userRole) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
