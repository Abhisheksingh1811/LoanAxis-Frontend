import axiosClient from "./axiosClient"

export type AuditLogUserView = {
  id: number
  username: string
  email: string
}

export type AuditLogResponse = {
  id: number
  eventType: string
  user: AuditLogUserView | null
  resource: string | null
  failureReason: string | null
  details: string | null
  success: boolean
  occurredAt: string
}

export type AuditLogsPageResponse = {
  content: AuditLogResponse[]
  totalElements: number
  totalPages: number
  pageSize: number
  pageNumber: number
  isFirst: boolean
  isLast: boolean
}

export type AdminUserRole = "CUSTOMER" | "CREDIT_OFFICER" | "OFFICER" | "ADMIN"

export type AdminUser = {
  id: number
  username: string
  email: string
  fullName: string
  role: AdminUserRole
  district: string | null
  accountLocked: boolean
  failedLoginAttempts: number
  lockedUntil: string | null
}

export type AdminUsersPageResponse = {
  content: AdminUser[]
  totalElements: number
  totalPages: number
  pageSize: number
  pageNumber: number
  isFirst: boolean
  isLast: boolean
}

export type GetAdminUsersParams = {
  search?: string
  role?: AdminUserRole | "ALL"
  district?: string
  accountLocked?: boolean | "ALL"
  page?: number
  size?: number
  sortBy?: string
  direction?: "ASC" | "DESC"
}

function buildAdminUsersParams(params: GetAdminUsersParams = {}) {
  const queryParams: Record<string, string | number | boolean> = {
    page: params.page ?? 0,
    size: params.size ?? 20,
    sortBy: params.sortBy ?? "id",
    direction: params.direction ?? "DESC",
  }

  if (params.search?.trim()) {
    queryParams.search = params.search.trim()
  }

  if (params.role && params.role !== "ALL") {
    queryParams.role = params.role
  }

  if (params.district?.trim()) {
    queryParams.district = params.district.trim()
  }

  if (params.accountLocked !== undefined && params.accountLocked !== "ALL") {
    queryParams.accountLocked = params.accountLocked
  }

  return queryParams
}

export const adminApi = {
  getAuditLogs: (page = 0, size = 20) =>
    axiosClient.get<AuditLogsPageResponse>("/api/admin/security/audit-logs", {
      params: {
        page,
        size,
        sortBy: "id",
        direction: "DESC",
      },
    }),

  getAdminUsers: (params: GetAdminUsersParams = {}) =>
    axiosClient.get<AdminUsersPageResponse>("/api/admin/users", {
      params: buildAdminUsersParams(params),
    }),

  lockUser: (userId: number) =>
    axiosClient.post(`/api/admin/users/${userId}/lock`),

  unlockUser: (userId: number) =>
    axiosClient.post(`/api/admin/users/${userId}/unlock`),
}