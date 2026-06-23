import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, LogOut, ScrollText, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

import { authApi } from "@/api/authApi"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  { label: "User Security", href: "/admin/user-security", icon: ShieldAlert },
]

export default function AdminLayout() {
  const location = useLocation()
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800 bg-slate-950 px-4 py-6 lg:block">
        <div className="mb-8 px-3">
          <p className="text-sm font-medium text-blue-300">LoanAxis</p>
          <h1 className="text-xl font-semibold">Admin Console</h1>
          <p className="mt-1 text-xs text-slate-500">{user?.fullName}</p>
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

        <div className="absolute bottom-6 left-4 right-4">
          <Button variant="secondary" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="lg:pl-72">
        <div className="min-h-screen p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}