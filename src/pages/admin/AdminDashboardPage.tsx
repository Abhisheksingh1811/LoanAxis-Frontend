import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  ScrollText,
  ShieldAlert,
  XCircle,
} from "lucide-react"

import { adminApi } from "@/api/adminApi"
import type { AuditLogResponse } from "@/api/adminApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardPage() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminApi.getAuditLogs(0, 50)
        setLogs(response.data.content)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const successfulEvents = logs.filter((log) => log.success).length
  const failedEvents = logs.filter((log) => !log.success).length
  const recentLogs = logs.slice(0, 5)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 bg-slate-800" />
        <Skeleton className="h-32 bg-slate-800" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white">
        <p className="text-sm font-medium text-blue-300">LoanAxis Admin</p>
        <h1 className="mt-1 text-3xl font-bold">Security command center</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor audit activity, review failed events, and manage account
          security actions from the admin console.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/audit-logs">
              View audit logs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="secondary">
            <Link to="/admin/user-security">User security</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm text-slate-300">Audit Events</CardTitle>
            <ScrollText className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{logs.length}</p>
            <p className="text-xs text-slate-500">Recent loaded events</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm text-slate-300">Successful</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{successfulEvents}</p>
            <p className="text-xs text-slate-500">Successful security events</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm text-slate-300">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{failedEvents}</p>
            <p className="text-xs text-slate-500">Events requiring review</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent audit activity</CardTitle>
          <ShieldAlert className="h-5 w-5 text-blue-300" />
        </CardHeader>

        <CardContent className="space-y-3">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-slate-400">No recent audit activity.</p>
          ) : (
            recentLogs.map((log) => (
              <div
                key={log.id}
                className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm md:grid-cols-4"
              >
                <div>
                  <p className="text-xs text-slate-500">Event</p>
                  <p className="font-medium">{log.eventType}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">User</p>
                  <p className="break-words">{log.user?.username || "System"}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p>{log.success ? "SUCCESS" : "FAILED"}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Time</p>
                  <p>{new Date(log.occurredAt).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}