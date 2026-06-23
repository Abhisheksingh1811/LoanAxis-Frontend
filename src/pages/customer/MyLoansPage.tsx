import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Landmark } from "lucide-react"

import { loanApi } from "@/api/loanApi"
import type { MyLoanResponse } from "@/api/loanApi"
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

export default function MyLoansPage() {
  const [loans, setLoans] = useState<MyLoanResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await loanApi.getMyLoans()
        setLoans(response.data)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoans()
  }, [])

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-blue-300">LoanAxis</p>
        <h1 className="text-3xl font-bold text-white">My loans</h1>
        <p className="mt-2 text-sm text-slate-400">
          View active loans, repayment progress, balances, and due dates.
        </p>
      </section>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 bg-slate-800" />
          <Skeleton className="h-32 bg-slate-800" />
        </div>
      ) : loans.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Landmark className="mb-4 h-10 w-10 text-slate-500" />
            <h2 className="text-xl font-semibold">No loans found</h2>
            <p className="mt-2 text-sm text-slate-400">
              Approved applications will appear here as loans.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <Card
              key={loan.id}
              className="border-slate-800 bg-slate-900 text-white"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">{loan.loanType} Loan</CardTitle>
                <Badge>{loan.status}</Badge>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-5 md:items-center">
                <div>
                  <p className="text-xs text-slate-500">Principal</p>
                  <p className="font-medium">
                    {formatCurrency(loan.principalAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Remaining</p>
                  <p className="font-medium">
                    {formatCurrency(loan.remainingBalance)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Monthly EMI</p>
                  <p className="font-medium">
                    {formatCurrency(loan.monthlyInstallment)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Next due date</p>
                  <p className="font-medium">
                    {loan.nextDueDate
                      ? new Date(loan.nextDueDate).toLocaleDateString("en-IN")
                      : "No pending dues"}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button asChild variant="secondary">
                    <Link to={`/customer/loans/${loan.id}`}>
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
    </div>
  )
}