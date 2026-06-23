import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle2, Landmark } from "lucide-react"

import { loanApi } from "@/api/loanApi"
import type { LoanDetailsResponse, LoanInstallmentView } from "@/api/loanApi"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function LoanDetailsPage() {
  const { loanId } = useParams()

  const [loan, setLoan] = useState<LoanDetailsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInstallment, setSelectedInstallment] =
    useState<LoanInstallmentView | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("UPI")
  const [isPaying, setIsPaying] = useState(false)

  const fetchLoan = async () => {
    if (!loanId) return

    const response = await loanApi.getById(Number(loanId))
    setLoan(response.data)
  }

  useEffect(() => {
    const loadLoan = async () => {
      try {
        await fetchLoan()
      } finally {
        setIsLoading(false)
      }
    }

    loadLoan()
  }, [loanId])

  const openPaymentDialog = (installment: LoanInstallmentView) => {
    setSelectedInstallment(installment)
    setPaymentAmount(String(installment.amount))
    setPaymentMethod("UPI")
  }

  const handlePayment = async () => {
    if (!loanId || !selectedInstallment?.id) {
      toast.error("Installment ID missing from backend response")
      return
    }

    setIsPaying(true)

    try {
      await loanApi.payInstallment(Number(loanId), selectedInstallment.id, {
        amount: Number(paymentAmount),
        paymentMethod,
      })

      toast.success("Installment paid successfully")
      setSelectedInstallment(null)
      await fetchLoan()
    } catch (error: any) {
      const message = error.response?.data?.message || "Payment failed"
      toast.error(message)
    } finally {
      setIsPaying(false)
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

  if (!loan) {
    return (
      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardContent className="py-12 text-center">Loan not found</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="secondary" size="sm">
        <Link to="/customer/loans">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to loans
        </Link>
      </Button>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            <Landmark className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-medium text-blue-300">LoanAxis</p>
            <h1 className="text-3xl font-bold">Loan #{loan.id}</h1>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Principal amount</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(loan.principalAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Remaining balance</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(loan.remainingBalance)}
            </p>
          </div>
        </div>
      </section>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Installment schedule</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {loan.installments.map((installment) => (
            <div
              key={installment.installmentNumber}
              className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:grid-cols-6 md:items-center"
            >
              <div>
                <p className="text-xs text-slate-500">Installment</p>
                <p className="font-semibold">#{installment.installmentNumber}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Due date</p>
                <p className="font-semibold">
                  {new Date(installment.dueDate).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Amount</p>
                <p className="font-semibold">
                  {formatCurrency(installment.amount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Principal</p>
                <p className="font-semibold">
                  {formatCurrency(installment.principalAmount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Interest</p>
                <p className="font-semibold">
                  {formatCurrency(installment.interestAmount)}
                </p>
              </div>

              <div className="flex justify-end">
                {installment.status === "PAID" ? (
                  <Badge className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    PAID
                  </Badge>
                ) : installment.id ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openPaymentDialog(installment)}
                  >
                    Pay
                  </Button>
                ) : (
                  <Badge variant="outline">{installment.status}</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedInstallment)}
        onOpenChange={(open) => {
          if (!open) setSelectedInstallment(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay installment</DialogTitle>
            <DialogDescription>
              Confirm payment for installment #
              {selectedInstallment?.installmentNumber}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment method</Label>
              <Input
                id="paymentMethod"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                placeholder="UPI"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setSelectedInstallment(null)}
            >
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isPaying}>
              {isPaying ? "Processing..." : "Confirm payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}