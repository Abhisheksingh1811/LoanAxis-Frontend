import { Link, Navigate } from "react-router-dom"
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react"

import { useAuth } from "@/auth/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Secure customer onboarding",
    description:
      "Register customers with verified identity, income, credit score, and district-based routing.",
    icon: ShieldCheck,
  },
  {
    title: "Loan application workflows",
    description:
      "Customers apply, officers review, and approvals generate active loans with installments.",
    icon: Workflow,
  },
  {
    title: "Role-based portals",
    description:
      "Dedicated dashboards for customers, credit officers, and administrators.",
    icon: Users,
  },
]

const workflowSteps = [
  "Customer applies",
  "Eligibility evaluated",
  "Officer reviews",
  "Loan is created",
  "Installments tracked",
]

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user?.role === "ROLE_ADMIN") {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (isAuthenticated && user?.role === "ROLE_CREDIT_OFFICER") {
    return <Navigate to="/officer/dashboard" replace />
  }

  if (isAuthenticated && user?.role === "ROLE_CUSTOMER") {
    return <Navigate to="/customer/dashboard" replace />
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-6">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-500 text-white shadow-lg shadow-blue-500/30">
              <Landmark className="h-7 w-7" />
            </div>

            <div>
              <p className="text-3xl font-bold leading-none tracking-tight">
                LoanAxis
              </p>
              <p className="mt-1 text-sm text-slate-400 sm:text-base">
                Secure Loan Origination & Servicing Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Button asChild size="lg" variant="secondary" className="px-6">
              <Link to="/login">Login</Link>
            </Button>

            <Button asChild size="lg" className="px-6">
              <Link to="/register">Create account</Link>
            </Button>
          </div>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-12 py-20 pt-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
          
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Secure loan workflows from application to repayment.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              LoanAxis helps customers apply for loans, credit officers review
              applications, and admins monitor security events through a modern
              role-based lending platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/register">
                  Start application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="secondary">
                <Link to="/login">Login to dashboard</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-300" />
                JWT secured
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-300" />
                Role-based access
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-300" />
                Audit monitored
              </div>
            </div>
          </div>

          <Card className="border-slate-800 bg-slate-900/80 text-white shadow-2xl shadow-blue-950/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">LoanAxis Dashboard</p>
                  <h2 className="text-2xl font-bold">Workflow overview</h2>
                </div>

                <Badge>Live</Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Applications</p>
                  <p className="mt-2 text-3xl font-bold">128</p>
                  <p className="mt-1 text-xs text-slate-400">Tracked securely</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Pending review</p>
                  <p className="mt-2 text-3xl font-bold">24</p>
                  <p className="mt-1 text-xs text-slate-400">Officer queue</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Security events</p>
                  <p className="mt-2 text-3xl font-bold">412</p>
                  <p className="mt-1 text-xs text-slate-400">Audit logged</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {workflowSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-300">
                      {index + 1}
                    </div>

                    <p className="text-sm font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <Card
                key={feature.title}
                className="border-slate-800 bg-slate-900 text-white"
              >
                <CardContent className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium text-blue-300">
              Built for secure lending operations
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              One platform for customers, officers, and admins.
            </h2>

            <p className="mt-4 text-slate-400">
              LoanAxis brings the complete loan lifecycle into one system:
              customer application, officer approval, loan creation, installment
              tracking, login history, and admin audit monitoring.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <Activity className="h-5 w-5 text-blue-300" />
              <p className="text-sm text-slate-300">
                Real-time application and loan workflow screens.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <ShieldCheck className="h-5 w-5 text-blue-300" />
              <p className="text-sm text-slate-300">
                Security-first design with login history and audit trails.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <Workflow className="h-5 w-5 text-blue-300" />
              <p className="text-sm text-slate-300">
                Officer-based decision flow with approval and rejection actions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}