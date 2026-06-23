import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  ArrowRight,
  BadgeIndianRupee,
  Clock,
  FileText,
  Landmark,
  LogOut,
  PlusCircle,
  ShieldCheck,
} from "lucide-react"

import { authApi } from "@/api/authApi"
import { useAuth } from "@/auth/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const quickActions = [
  {
    title: "Apply for a loan",
    description: "Start a new loan application in minutes.",
    href: "/customer/apply",
    icon: PlusCircle,
  },
  {
    title: "View applications",
    description: "Track approval status and officer review.",
    href: "/customer/applications",
    icon: FileText,
  },
  {
    title: "My loans",
    description: "View active loans and repayment schedule.",
    href: "/customer/loans",
    icon: Landmark,
  },
]

export default function CustomerDashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await authApi.logout()
      toast.success("Logged out successfully")
    } catch {
      toast.error("Session cleared locally")
    } finally {
      logout()
      navigate("/login")
    }
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3">
            Customer Portal
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.fullName}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Manage your loan applications, repayments, and security activity
            from your LoanAxis dashboard.
          </p>
        </div>

        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-300">
              Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">--</div>
            <p className="text-xs text-slate-500">API integration next</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-300">
              Active Loans
            </CardTitle>
            <Landmark className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">--</div>
            <p className="text-xs text-slate-500">API integration next</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-300">
              Repayments
            </CardTitle>
            <BadgeIndianRupee className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">--</div>
            <p className="text-xs text-slate-500">Shown inside loan details</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-300">
              Security
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Active</div>
            <p className="text-xs text-slate-500">JWT + role protection</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon

          return (
            <Link key={action.href} to={action.href}>
              <Card className="h-full border-slate-800 bg-slate-900 text-white transition hover:-translate-y-1 hover:border-blue-400/60">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{action.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex items-center justify-between text-sm text-slate-400">
                  <span>{action.description}</span>
                  <ArrowRight className="h-4 w-4" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-300" />
          <h2 className="text-lg font-semibold">Next engineering step</h2>
        </div>

        <p className="mt-3 text-sm text-slate-400">
          We will now connect customer pages to real backend APIs: applications,
          loans, installments, and login history.
        </p>
      </section>
    </div>
  )
}