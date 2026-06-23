import { Link, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, FileText, Landmark, History, Settings, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
  { label: "Apply for Loan", href: "/customer/apply", icon: PlusCircle },
  { label: "My Applications", href: "/customer/applications", icon: FileText },
  { label: "My Loans", href: "/customer/loans", icon: Landmark },
  { label: "Security Activity", href: "/customer/login-history", icon: History },
  { label: "Settings", href: "/customer/settings", icon: Settings },
]

export default function CustomerLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800 bg-slate-950 px-4 py-6 lg:block">
        <div className="mb-8 px-3">
          <p className="text-sm font-medium text-blue-300">LoanAxis</p>
          <h1 className="text-xl font-semibold">Customer Portal</h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="lg:pl-72">
        <div className="min-h-screen p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}