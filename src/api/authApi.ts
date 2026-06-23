import axiosClient from "./axiosClient"

export type LoginRequest = {
  username: string
  password: string
}

export type LoginUser = {
  id: number
  username: string
  email: string
  fullName: string
  role: "ROLE_CUSTOMER" | "ROLE_CREDIT_OFFICER" | "ROLE_ADMIN"
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: LoginUser
}

export type RegisterRequest = {
  username: string
  password: string
  matchingPassword: string
  email: string
  fullName: string
  identityNumber: string
  phoneNumber: string
  birthDate: string
  monthlyIncome: number
  creditScore: number
  district: string
}

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<LoginResponse>("/api/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post("/api/auth/register", data),

  logout: () => axiosClient.post("/api/auth/logout"),

  refresh: (refreshToken: string) =>
    axiosClient.post("/api/auth/refresh", { refreshToken }),
}