import { useEffect, useState } from "react"
import { CheckCircle2, MonitorSmartphone, XCircle } from "lucide-react"

import { loginHistoryApi } from "@/api/loginHistoryApi"
import type { UserLoginHistoryResponse } from "@/api/loginHistoryApi"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoginHistoryPage() {
  const [history, setHistory] = useState<UserLoginHistoryResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await loginHistoryApi.getMyLoginHistory()
        setHistory(response.data)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div className="space-y-6">
      <section>
      <p className="text-sm font-medium text-blue-300">LoanAxis Officer Security</p>
<h1 className="text-3xl font-bold text-white">Security activity</h1>
<p className="mt-2 text-sm text-slate-400">
  Review recent sign-in activity recorded for your officer account.
</p>
      </section>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 bg-slate-800" />
          <Skeleton className="h-24 bg-slate-800" />
          <Skeleton className="h-24 bg-slate-800" />
        </div>
      ) : history.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="py-12 text-center">
            No login history found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <Card
              key={entry.id}
              className="border-slate-800 bg-slate-900 text-white"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <MonitorSmartphone className="h-5 w-5" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      {entry.browser || "Unknown browser"} on{" "}
                      {entry.os || "Unknown OS"}
                    </CardTitle>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(entry.timestamp).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <Badge variant={entry.success ? "default" : "destructive"}>
                  {entry.success ? (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                  )}
                  {entry.success ? "SUCCESS" : "FAILED"}
                </Badge>
              </CardHeader>

              <CardContent className="grid gap-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">IP address</p>
                  <p>{entry.ipAddress || "Unknown"}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Device</p>
                  <p>{entry.device || "Unknown"}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Failure reason</p>
                  <p>{entry.failureReason || "None"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}