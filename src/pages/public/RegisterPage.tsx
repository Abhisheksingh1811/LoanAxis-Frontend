import { type FormEvent, type ReactNode, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"

import { authApi } from "@/api/authApi"
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

const districts = [
  "ADILABAD",
  "BHADRADRI_KOTHAGUDEM",
  "HANAMKONDA",
  "HYDERABAD",
  "JAGTIAL",
  "JANGAON",
  "JAYASHANKAR_BHUPALPALLY",
  "JOGULAMBA_GADWAL",
  "KAMAREDDY",
  "KARIMNAGAR",
  "KHAMMAM",
  "KOMARAM_BHEEM_ASIFABAD",
  "MAHABUBABAD",
  "MAHABUBNAGAR",
  "MANCHERIAL",
  "MEDAK",
  "MEDCHAL_MALKAJGIRI",
  "MULUGU",
  "NAGARKURNOOL",
  "NALGONDA",
  "NARAYANPET",
  "NIRMAL",
  "NIZAMABAD",
  "PEDDAPALLI",
  "RAJANNA_SIRCILLA",
  "RANGAREDDY",
  "SANGAREDDY",
  "SIDDIPET",
  "SURYAPET",
  "VIKARABAD",
  "WANAPARTHY",
  "WARANGAL",
  "YADADRI_BHUVANAGIRI",
]

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/

function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: ReactNode
}) {
  return (
    <Label htmlFor={htmlFor}>
      {children} <span className="text-red-400">*</span>
    </Label>
  )
}

function HelperText({ children }: { children: ReactNode }) {
  return <p className="text-xs text-slate-500">{children}</p>
}

function formatDistrict(district: string) {
  return district
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    password: "",
    matchingPassword: "",
    email: "",
    fullName: "",
    identityNumber: "",
    phoneNumber: "",
    birthDate: "",
    monthlyIncome: "",
    creditScore: "",
    district: "HYDERABAD",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const validateForm = () => {
    if (form.username.trim().length < 6 || form.username.trim().length > 50) {
      toast.error("Username must be 6 to 50 characters")
      return false
    }

    if (!passwordRegex.test(form.password)) {
      toast.error(
        "Password must be 8-32 chars with uppercase, lowercase, number, and @$!%*?&"
      )
      return false
    }

    if (form.password !== form.matchingPassword) {
      toast.error("Password and confirm password do not match")
      return false
    }

    if (form.identityNumber.trim().length !== 11) {
      toast.error("Identity number must be exactly 11 characters")
      return false
    }

    if (Number(form.monthlyIncome) <= 0) {
      toast.error("Monthly income must be greater than 0")
      return false
    }

    if (Number(form.creditScore) < 300 || Number(form.creditScore) > 850) {
      toast.error("Credit score must be between 300 and 850")
      return false
    }

    return true
  }

  const getBackendErrorMessage = (error: any) => {
    const details = error.response?.data?.details

    if (details && typeof details === "object") {
      const firstError = Object.entries(details)[0]

      if (firstError) {
        return `${firstError[0]}: ${String(firstError[1])}`
      }
    }

    return (
      error.response?.data?.message || "Registration failed. Please try again."
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await authApi.register({
        username: form.username.trim(),
        password: form.password,
        matchingPassword: form.matchingPassword,
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        identityNumber: form.identityNumber.trim(),
        phoneNumber: form.phoneNumber.trim(),
        birthDate: form.birthDate,
        monthlyIncome: Number(form.monthlyIncome),
        creditScore: Number(form.creditScore),
        district: form.district,
      })

      toast.success("Account created successfully. Please login.")
      navigate("/login")
    } catch (error: any) {
      toast.error(getBackendErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-blue-300">LoanAxis</p>
          <h1 className="mt-2 text-3xl font-bold">Create customer account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Register to apply for loans, track approvals, and manage repayments.
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Customer registration</CardTitle>
            <CardDescription>
              Fields marked with <span className="text-red-400">*</span> are required.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <RequiredLabel htmlFor="fullName">Full name</RequiredLabel>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Example: Abhishek Singh"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="username">Username</RequiredLabel>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={(event) =>
                      updateField("username", event.target.value)
                    }
                    placeholder="6 to 50 characters"
                    minLength={6}
                    maxLength={50}
                    required
                  />
                  <HelperText>6 to 50 characters.</HelperText>
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="email">Email</RequiredLabel>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="phoneNumber">Phone number</RequiredLabel>
                  <Input
                    id="phoneNumber"
                    value={form.phoneNumber}
                    onChange={(event) =>
                      updateField("phoneNumber", event.target.value)
                    }
                    placeholder="Example: 9876543210"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="identityNumber">
                    Identity number
                  </RequiredLabel>
                  <Input
                    id="identityNumber"
                    value={form.identityNumber}
                    onChange={(event) =>
                      updateField("identityNumber", event.target.value)
                    }
                    placeholder="Exactly 11 characters"
                    minLength={11}
                    maxLength={11}
                    required
                  />
                  <HelperText>Exactly 11 characters.</HelperText>
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="birthDate">Birth date</RequiredLabel>
                  <Input
                    id="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={(event) =>
                      updateField("birthDate", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="monthlyIncome">
                    Monthly income
                  </RequiredLabel>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    min="1"
                    value={form.monthlyIncome}
                    onChange={(event) =>
                      updateField("monthlyIncome", event.target.value)
                    }
                    placeholder="Example: 35000"
                    required
                  />
                  <HelperText>Must be greater than 0.</HelperText>
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="creditScore">Credit score</RequiredLabel>
                  <Input
                    id="creditScore"
                    type="number"
                    min="300"
                    max="850"
                    value={form.creditScore}
                    onChange={(event) =>
                      updateField("creditScore", event.target.value)
                    }
                    placeholder="300 - 850"
                    required
                  />
                  <HelperText>Must be between 300 and 850.</HelperText>
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="district">District</RequiredLabel>
                  <select
                    id="district"
                    value={form.district}
                    onChange={(event) =>
                      updateField("district", event.target.value)
                    }
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                    required
                  >
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {formatDistrict(district)}
                      </option>
                    ))}
                  </select>
                  <HelperText>
                    Used to route your application to the correct officer.
                  </HelperText>
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="password">Password</RequiredLabel>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="StrongPass@12345"
                    minLength={8}
                    maxLength={32}
                    required
                  />
                  <HelperText>
                    8-32 chars, uppercase, lowercase, number, and @$!%*?&.
                  </HelperText>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <RequiredLabel htmlFor="matchingPassword">
                    Confirm password
                  </RequiredLabel>
                  <Input
                    id="matchingPassword"
                    type="password"
                    value={form.matchingPassword}
                    onChange={(event) =>
                      updateField("matchingPassword", event.target.value)
                    }
                    placeholder="Repeat the same password"
                    minLength={8}
                    maxLength={32}
                    required
                  />
                  <HelperText>Must match the password.</HelperText>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={isSubmitting}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>

                <p className="text-sm text-slate-400">
                  Already registered?{" "}
                  <Link to="/login" className="font-medium text-blue-300">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}