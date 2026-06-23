import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"

import { officerApi } from "@/api/officerApi"
import type { OfficerApplicationResponse } from "@/api/officerApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function OfficerApplicationDetailsPage() {
  const { applicationId } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] =
    useState<OfficerApplicationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) return

      try {
        const response = await officerApi.getApplications(undefined, 0, 200)
        const selectedApplication = response.data.content.find(
          (item) => item.id === Number(applicationId)
        )

        if (!selectedApplication) {
          toast.error("Application not found")
          navigate("/officer/applications")
          return
        }

        setApplication(selectedApplication)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplication()
  }, [applicationId, navigate])

  const handleApprove = async () => {
    if (!application) return

    setIsApproving(true)

    try {
      const response = await officerApi.approveApplication(application.id)
      toast.success(`Application approved. Loan #${response.data.loanId} created.`)
      navigate("/officer/applications")
    } catch (error: any) {
      const message = error.response?.data?.message || "Approval failed"
      toast.error(message)
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!application) return

    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason")
      return
    }

    setIsRejecting(true)

    try {
      await officerApi.rejectApplication(application.id, rejectionReason)
      toast.success("Application rejected")
      navigate("/officer/applications")
    } catch (error: any) {
      const message = error.response?.data?.message || "Rejection failed"
      toast.error(message)
    } finally {
      setIsRejecting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-slate-800" />
        <Skeleton className="h-80 bg-slate-800" />
      </div>
    )
  }

  if (!application) {
    return null
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="secondary" size="sm">
        <Link to="/officer/applications">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to applications
        </Link>
      </Button>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-300">LoanAxis Review</p>
          <h1 className="text-3xl font-bold">
            Application #{application.id}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Review customer eligibility, credit score, DTI ratio, and loan request.
          </p>
        </div>

        <Badge className="w-fit text-sm">{application.status}</Badge>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Customer profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Full name</p>
              <p className="mt-1 text-lg font-semibold">
                {application.customer.fullName}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Credit score</p>
              <p className="mt-1 text-lg font-semibold">
                {application.customer.creditScore}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Monthly income</p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(application.customer.monthlyIncome)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Loan request</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
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
              <p className="text-xs text-slate-500">DTI ratio</p>
              <p className="mt-1 text-lg font-semibold">
                {(application.dtiRatio * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {application.status === "PENDING" && (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Officer decision</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 md:flex-row">
            <Button onClick={handleApprove} disabled={isApproving}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isApproving ? "Approving..." : "Approve application"}
            </Button>

            <Button
              variant="destructive"
              onClick={() => setRejectDialogOpen(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject application
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
            <DialogDescription>
              Enter a clear reason for rejecting this loan application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="rejectionReason">Rejection reason</Label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
              placeholder="Reason for rejection"
            />
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Confirm rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}