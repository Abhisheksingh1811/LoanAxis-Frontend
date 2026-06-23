import { createContext, useContext, useMemo, useState } from "react"
import type { LoginUser } from "@/api/authApi"

type AuthContextValue = {
  user: LoginUser | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string, user: LoginUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  )

  const [user, setUser] = useState<LoginUser | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  const login = (
    newAccessToken: string,
    refreshToken: string,
    newUser: LoginUser
  ) => {
    localStorage.setItem("accessToken", newAccessToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("user", JSON.stringify(newUser))

    setAccessToken(newAccessToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")

    setAccessToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      login,
      logout,
    }),
    [accessToken, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}