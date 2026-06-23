import axiosClient from "./axiosClient"

export type AuditEventType = "LOGIN_SUCCESS" | "LOGIN_FAILURE" | string

export type UserLoginHistoryResponse = {
  id: number
  ipAddress: string | null
  device: string | null
  location: string | null
  userAgent: string | null
  browser: string | null
  os: string | null
  success: boolean
  failureReason: string | null
  timestamp: string
  eventType: AuditEventType
}

export const loginHistoryApi = {
  getMyLoginHistory: () =>
    axiosClient.get<UserLoginHistoryResponse[]>("/api/audit/login-history"),
}