import { Navigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import type { LoginUser } from "@/api/authApi"

type RoleRouteProps = {
  allowedRoles: LoginUser["role"][]
  children: React.ReactNode
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}