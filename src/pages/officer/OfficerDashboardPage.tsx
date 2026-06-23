import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle2, ClipboardCheck, Clock, XCircle } from "lucide-react"

import { officerApi } from "@/api/officerApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type DashboardStats = {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function OfficerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [all, pending, approved, rejected] = await Promise.all([
          officerApi.getApplications(undefined, 0, 1),
          officerApi.getApplications("PENDING", 0, 1),
          officerApi.getApplications("APPROVED", 0, 1),
          officerApi.getApplications("REJECTED", 0, 1),
        ])

        setStats({
          total: all.data.totalElements,
          pending: pending.data.totalElements,
          approved: approved.data.totalElements,
          rejected: rejected.data.totalElements,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

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
        <p className="text-sm font-medium text-blue-300">LoanAxis Officer</p>
        <h1 className="mt-1 text-3xl font-bold">Review dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor assigned loan applications, review pending cases, and complete
          approval or rejection workflows.
        </p>

        <Button asChild className="mt-5">
          <Link to="/officer/applications">
            Review applications
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm text-slate-300">Total</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-xs text-slate-500">Assigned applications</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm text-slate-300">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pending}</p>
            <p className="text-xs text-slate-500">Awaiting officer decision</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm text-slate-300">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.approved}</p>
            <p className="text-xs text-slate-500">Loans created after review</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm text-slate-300">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.rejected}</p>
            <p className="text-xs text-slate-500">Rejected after validation</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}