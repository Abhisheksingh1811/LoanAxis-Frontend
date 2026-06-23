import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import {
  Lock,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  Users,
} from "lucide-react"

import {
  adminApi,
  type AdminUser,
  type AdminUserRole,
} from "@/api/adminApi"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LockedFilter = "ALL" | "LOCKED" | "ACTIVE"
type RoleFilter = "ALL" | AdminUserRole

export default function UserSecurityPage() {
  const [users, setUsers] = useState<AdminUser[]>([])

  const [search, setSearch] = useState("")
  const [role, setRole] = useState<RoleFilter>("ALL")
  const [lockedFilter, setLockedFilter] = useState<LockedFilter>("ALL")

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [actionUserId, setActionUserId] = useState<number | null>(null)

  const latestRequestId = useRef(0)

  const accountLockedParam = useMemo(() => {
    if (lockedFilter === "LOCKED") return true
    if (lockedFilter === "ACTIVE") return false
    return "ALL"
  }, [lockedFilter])

  const isInitialLoading = isLoading && !hasLoadedOnce
  const isRefreshingResults = isLoading && hasLoadedOnce

  const fetchUsers = async (targetPage = 0) => {
    const requestId = latestRequestId.current + 1
    latestRequestId.current = requestId

    setIsLoading(true)

    try {
      const response = await adminApi.getAdminUsers({
        search,
        role,
        accountLocked: accountLockedParam,
        page: targetPage,
        size: 10,
        sortBy: "id",
        direction: "DESC",
      })

      if (requestId !== latestRequestId.current) {
        return
      }

      setUsers(response.data.content ?? [])
      setTotalPages(response.data.totalPages ?? 0)
      setTotalElements(response.data.totalElements ?? 0)
      setPage(response.data.pageNumber ?? targetPage)
      setHasLoadedOnce(true)
    } catch (error: any) {
      if (requestId !== latestRequestId.current) {
        return
      }

      const message =
        error.response?.data?.message || "Failed to load admin users"
      toast.error(message)
    } finally {
      if (requestId === latestRequestId.current) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchUsers(0)
    }, 300)

    return () => window.clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, lockedFilter])

  const handleRefresh = () => {
    fetchUsers(page)
  }

  const handleResetFilters = () => {
    const alreadyReset =
      search === "" && role === "ALL" && lockedFilter === "ALL"

    setSearch("")
    setRole("ALL")
    setLockedFilter("ALL")
    setPage(0)

    if (alreadyReset) {
      fetchUsers(0)
    }
  }

  const handleLockUser = async (user: AdminUser) => {
    setActionUserId(user.id)

    try {
      await adminApi.lockUser(user.id)
      toast.success(`User #${user.id} locked successfully`)
      fetchUsers(page)
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to lock user"
      toast.error(message)
    } finally {
      setActionUserId(null)
    }
  }

  const handleUnlockUser = async (user: AdminUser) => {
    setActionUserId(user.id)

    try {
      await adminApi.unlockUser(user.id)
      toast.success(`User #${user.id} unlocked successfully`)
      fetchUsers(page)
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to unlock user"
      toast.error(message)
    } finally {
      setActionUserId(null)
    }
  }

  const formatDateTime = (value: string | null) => {
    if (!value) return "—"
    return new Date(value).toLocaleString()
  }

  const formatRole = (value: AdminUserRole) => {
    if (value === "CREDIT_OFFICER" || value === "OFFICER") {
      return "CREDIT OFFICER"
    }

    return value
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-blue-300">LoanAxis Admin</p>
          <h1 className="text-3xl font-bold text-white">User security</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Search users, review account lock status, and take security actions
            during suspicious activity or account recovery workflows.
          </p>
        </div>

        <Button variant="secondary" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCcw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Users found</p>
              <p className="text-2xl font-bold">{totalElements}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Locked in page</p>
              <p className="text-2xl font-bold">
                {users.filter((user) => user.accountLocked).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active in page</p>
              <p className="text-2xl font-bold">
                {users.filter((user) => !user.accountLocked).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <CardTitle>User directory</CardTitle>
              <CardDescription>
                Search is automatic. Role and status filters are applied
                instantly and combined with the search text.
              </CardDescription>
            </div>

            {isRefreshingResults && (
              <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                Updating results...
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr_auto] lg:items-end">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  id="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(0)
                  }}
                  placeholder="Start typing username, email, or full name"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value as RoleFilter)
                  setPage(0)
                }}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="ALL">All roles</option>
                <option value="CUSTOMER">Customer</option>
                <option value="CREDIT_OFFICER">Credit Officer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockedStatus">Status</Label>
              <select
                id="lockedStatus"
                value={lockedFilter}
                onChange={(event) => {
                  setLockedFilter(event.target.value as LockedFilter)
                  setPage(0)
                }}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="ALL">All users</option>
                <option value="ACTIVE">Active only</option>
                <option value="LOCKED">Locked only</option>
              </select>
            </div>

            <Button
              variant="secondary"
              onClick={handleResetFilters}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <div className="overflow-x-auto">
              <table
                className={`w-full min-w-[980px] text-left text-sm transition-opacity duration-200 ${
                  isRefreshingResults ? "opacity-80" : "opacity-100"
                }`}
              >
                <thead className="bg-slate-950 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Failed attempts</th>
                    <th className="px-4 py-3">Lock status</th>
                    <th className="px-4 py-3">Locked until</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {isInitialLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        No users found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="bg-slate-900/60 transition hover:bg-slate-800/60"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-white">
                              #{user.id} · {user.fullName}
                            </div>
                            <div className="text-xs text-slate-400">
                              {user.username} · {user.email}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-200">
                            {formatRole(user.role)}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {user.district ?? "—"}
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {user.failedLoginAttempts ?? 0}
                        </td>

                        <td className="px-4 py-4">
                          {user.accountLocked ? (
                            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-200">
                              Locked
                            </span>
                          ) : (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {formatDateTime(user.lockedUntil)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          {user.accountLocked ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleUnlockUser(user)}
                              disabled={actionUserId === user.id}
                            >
                              <Unlock className="mr-2 h-4 w-4" />
                              {actionUserId === user.id
                                ? "Unlocking..."
                                : "Unlock"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleLockUser(user)}
                              disabled={actionUserId === user.id}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              {actionUserId === user.id
                                ? "Locking..."
                                : "Lock"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-400 sm:flex-row">
            <p>
              Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={isLoading || page <= 0}
                onClick={() => fetchUsers(page - 1)}
              >
                Previous
              </Button>

              <Button
                variant="secondary"
                disabled={isLoading || page + 1 >= totalPages}
                onClick={() => fetchUsers(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Admin note</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-slate-400">
          Every lock and unlock action is recorded in backend audit logs. Use
          the Audit Logs page to verify who performed the action and when.
        </CardContent>
      </Card>
    </div>
  )
}