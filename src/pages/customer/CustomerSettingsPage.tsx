import { useState } from "react"
import { toast } from "sonner"
import { KeyRound, UserCircle } from "lucide-react"

import { useAuth } from "@/auth/AuthContext"
import { userApi } from "@/api/userApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CustomerSettingsPage() {
  const { user } = useAuth()

  const [oldPassword, setOldPassword] = useState("")
  const [password, setPassword] = useState("")
  const [matchingPassword, setMatchingPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (password !== matchingPassword) {
      toast.error("New password and confirm password do not match")
      return
    }

    setIsSubmitting(true)

    try {
      await userApi.changePassword({
        oldPassword,
        password,
        matchingPassword,
      })

      toast.success("Password changed successfully")
      setOldPassword("")
      setPassword("")
      setMatchingPassword("")
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to change password"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section>
        <p className="text-sm font-medium text-blue-300">LoanAxis Account</p>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage your account profile and security settings.
        </p>
      </section>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCircle className="h-6 w-6 text-blue-300" />
            <div>
              <CardTitle>Profile details</CardTitle>
              <CardDescription>Your logged-in account information.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Full name</p>
            <p className="mt-1 font-semibold">{user?.fullName}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Username</p>
            <p className="mt-1 font-semibold">{user?.username}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Email</p>
            <p className="mt-1 font-semibold">{user?.email}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Role</p>
            <p className="mt-1 font-semibold">{user?.role}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <KeyRound className="h-6 w-6 text-blue-300" />
            <div>
              <CardTitle>Change password</CardTitle>
              <CardDescription>
                Update your password and secure your LoanAxis account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current password</Label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchingPassword">Confirm new password</Label>
                <Input
                  id="matchingPassword"
                  type="password"
                  value={matchingPassword}
                  onChange={(event) => setMatchingPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}