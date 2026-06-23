import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, FileText, RefreshCcw } from "lucide-react"

import { applicationApi } from "@/api/applicationApi"
import type {
  CustomerApplicationResponse,
  LoanApplicationStatus,
} from "@/api/applicationApi"
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

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<CustomerApplicationResponse[]>([])
  const [selectedStatus, setSelectedStatus] =
    useState<LoanApplicationStatus | "ALL">("ALL")
  const [isLoading, setIsLoading] = useState(true)

  const fetchApplications = async () => {
    setIsLoading(true)

    try {
      const response = await applicationApi.getMyApplications(
        selectedStatus === "ALL" ? undefined : selectedStatus
      )
      setApplications(response.data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [selectedStatus])

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-300">LoanAxis</p>
          <h1 className="text-3xl font-bold text-white">My applications</h1>
          <p className="mt-2 text-sm text-slate-400">
            Track every loan request submitted from your customer account.
          </p>
        </div>

        <Button asChild>
          <Link to="/customer/apply">New application</Link>
        </Button>
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
          <Skeleton className="h-28 bg-slate-800" />
          <Skeleton className="h-28 bg-slate-800" />
          <Skeleton className="h-28 bg-slate-800" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-10 w-10 text-slate-500" />
            <h2 className="text-xl font-semibold">No applications found</h2>
            <p className="mt-2 text-sm text-slate-400">
              Submit a new loan application to see it here.
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
                  {application.loanType} Loan
                </CardTitle>

                <Badge variant={getStatusVariant(application.status)}>
                  {application.status}
                </Badge>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-4 md:items-center">
                <div>
                  <p className="text-xs text-slate-500">Application ID</p>
                  <p className="font-medium">#{application.id}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Requested amount</p>
                  <p className="font-medium">
                    {formatCurrency(application.requestedAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Created at</p>
                  <p className="font-medium">
                    {new Date(application.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button asChild variant="secondary">
                    <Link to={`/customer/applications/${application.id}`}>
                      Details
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