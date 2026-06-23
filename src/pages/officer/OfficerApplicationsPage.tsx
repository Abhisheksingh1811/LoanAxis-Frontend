import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ClipboardCheck, RefreshCcw } from "lucide-react"

import { officerApi } from "@/api/officerApi"
import type {
  LoanApplicationStatus,
  OfficerApplicationResponse,
} from "@/api/officerApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const statuses: Array<LoanApplicationStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "AUTO_REJECTED",
  "CANCELLED",
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusVariant(status: LoanApplicationStatus) {
  if (status === "APPROVED") return "default"
  if (status === "PENDING") return "secondary"
  if (status === "REJECTED" || status === "AUTO_REJECTED") return "destructive"
  return "outline"
}

export default function OfficerApplicationsPage() {
  const [applications, setApplications] = useState<OfficerApplicationResponse[]>([])
  const [selectedStatus, setSelectedStatus] =
    useState<LoanApplicationStatus | "ALL">("ALL")
  const [isLoading, setIsLoading] = useState(true)

  const fetchApplications = async () => {
    setIsLoading(true)

    try {
      const response = await officerApi.getApplications(
        selectedStatus === "ALL" ? undefined : selectedStatus
      )
      setApplications(response.data.content)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [selectedStatus])

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-blue-300">LoanAxis Officer</p>
        <h1 className="text-3xl font-bold text-white">Loan applications</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review customer applications assigned to your district authorization.
        </p>
      </section>

      <section className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </Button>
        ))}
      </section>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 bg-slate-800" />
          <Skeleton className="h-32 bg-slate-800" />
          <Skeleton className="h-32 bg-slate-800" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardCheck className="mb-4 h-10 w-10 text-slate-500" />
            <h2 className="text-xl font-semibold">No applications found</h2>
            <p className="mt-2 text-sm text-slate-400">
              Matching applications will appear here for review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="border-slate-800 bg-slate-900 text-white"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">
                  {application.customer.fullName}
                </CardTitle>

                <Badge variant={getStatusVariant(application.status)}>
                  {application.status}
                </Badge>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-6 md:items-center">
                <div>
                  <p className="text-xs text-slate-500">Application</p>
                  <p className="font-medium">#{application.id}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Loan type</p>
                  <p className="font-medium">{application.loanType}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(application.requestedAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Credit score</p>
                  <p className="font-medium">
                    {application.customer.creditScore}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">DTI</p>
                  <p className="font-medium">
                    {(application.dtiRatio * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button asChild variant="secondary">
                    <Link to={`/officer/applications/${application.id}`}>
                      Review
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button variant="secondary" size="sm" onClick={fetchApplications}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>
  )
}