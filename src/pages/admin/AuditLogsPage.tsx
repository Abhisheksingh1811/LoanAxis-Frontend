import { useEffect, useState } from "react"
import { RefreshCcw, ScrollText } from "lucide-react"

import { adminApi } from "@/api/adminApi"
import type { AuditLogResponse } from "@/api/adminApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLogs = async () => {
    setIsLoading(true)

    try {
      const response = await adminApi.getAuditLogs()
      setLogs(response.data.content)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-300">LoanAxis Admin</p>
          <h1 className="text-3xl font-bold text-white">Audit logs</h1>
          <p className="mt-2 text-sm text-slate-400">
            Monitor security events, user actions, and system audit trails.
          </p>
        </div>

        <Button variant="secondary" onClick={fetchLogs}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </section>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 bg-slate-800" />
          <Skeleton className="h-28 bg-slate-800" />
          <Skeleton className="h-28 bg-slate-800" />
        </div>
      ) : logs.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ScrollText className="mb-4 h-10 w-10 text-slate-500" />
            <h2 className="text-xl font-semibold">No audit logs found</h2>
            <p className="mt-2 text-sm text-slate-400">
              Security and business events will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card
              key={log.id}
              className="border-slate-800 bg-slate-900 text-white"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{log.eventType}</CardTitle>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(log.occurredAt).toLocaleString("en-IN")}
                  </p>
                </div>

                <Badge variant={log.success ? "default" : "destructive"}>
                  {log.success ? "SUCCESS" : "FAILED"}
                </Badge>
              </CardHeader>

              <CardContent className="grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
  <div className="min-w-0">
    <p className="text-xs text-slate-500">User</p>
    <p className="break-words">{log.user?.username || "System"}</p>
  </div>

  <div className="min-w-0">
    <p className="text-xs text-slate-500">Email</p>
    <p className="break-all">{log.user?.email || "N/A"}</p>
  </div>

  <div className="min-w-0 md:col-span-2">
    <p className="text-xs text-slate-500">Resource</p>
    <p className="break-all text-slate-300">{log.resource || "N/A"}</p>
  </div>

  <div className="min-w-0 md:col-span-2 xl:col-span-4">
    <p className="text-xs text-slate-500">Failure reason</p>
    <p className="break-words text-slate-300">
      {log.failureReason || "None"}
    </p>
  </div>

  {log.details && (
    <div className="min-w-0 md:col-span-2 xl:col-span-4">
      <p className="text-xs text-slate-500">Details</p>
      <p className="break-words text-slate-300">{log.details}</p>
    </div>
  )}
</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}