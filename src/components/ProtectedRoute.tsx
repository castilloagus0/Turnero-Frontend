import { Navigate, Outlet, useLocation } from 'react-router-dom'

type ProtectedRouteProps = {
  userRole: string
  allowedRoles?: string[]
}

/**
 * Layout route: renders <Outlet /> si userRole está en allowedRoles; si no, redirige a /login.
 */
export default function ProtectedRoute({ userRole, allowedRoles = [] }: ProtectedRouteProps) {
  const location = useLocation()
  const allowed = allowedRoles.includes(userRole)

  if (!allowed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
