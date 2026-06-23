import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, Trash2 } from "lucide-react"

import { applicationApi } from "@/api/applicationApi"
import type { CustomerApplicationResponse } from "@/api/applicationApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function ApplicationDetailsPage() {
  const { applicationId } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] =
    useState<CustomerApplicationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) return

      try {
        const response = await applicationApi.getById(Number(applicationId))
        setApplication(response.data)
      } catch {
        toast.error("Application not found")
        navigate("/customer/applications")
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplication()
  }, [applicationId, navigate])

  const handleCancel = async () => {
    if (!application) return

    setIsCancelling(true)

    try {
      await applicationApi.deleteById(application.id)
      toast.success("Application cancelled")
      navigate("/customer/applications")
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Only pending applications can be cancelled"
      toast.error(message)
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-slate-800" />
        <Skeleton className="h-72 bg-slate-800" />
      </div>
    )
  }

  if (!application) {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="secondary" size="sm">
        <Link to="/customer/applications">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to applications
        </Link>
      </Button>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-300">LoanAxis</p>
          <h1 className="mt-1 text-3xl font-bold">
            Application #{application.id}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Review your submitted loan application status and request details.
          </p>
        </div>

        <Badge className="w-fit text-sm">{application.status}</Badge>
      </section>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Application summary</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Loan type</p>
            <p className="mt-1 text-lg font-semibold">{application.loanType}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Requested amount</p>
            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(application.requestedAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Status</p>
            <p className="mt-1 text-lg font-semibold">{application.status}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Created at</p>
            <p className="mt-1 text-lg font-semibold">
              {new Date(application.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
        </CardContent>
      </Card>

      {application.status === "PENDING" && (
        <Card className="border-red-900/60 bg-red-950/30 text-white">
          <CardHeader>
            <CardTitle>Cancel application</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-red-100/80">
              Pending applications can be cancelled before officer approval.
            </p>

            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isCancelling ? "Cancelling..." : "Cancel application"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}