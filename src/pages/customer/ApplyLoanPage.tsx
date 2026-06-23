import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Send } from "lucide-react"

import { applicationApi } from "@/api/applicationApi"
import type { LoanType } from "@/api/applicationApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loanTypes: LoanType[] = ["PERSONAL", "VEHICLE", "MORTGAGE", "EDUCATION"]

export default function ApplyLoanPage() {
  const navigate = useNavigate()

  const [loanType, setLoanType] = useState<LoanType>("PERSONAL")
  const [requestedAmount, setRequestedAmount] = useState("")
  const [requestedTerm, setRequestedTerm] = useState("")
  const [purpose, setPurpose] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await applicationApi.create({
        loanType,
        requestedAmount: Number(requestedAmount),
        requestedTerm: Number(requestedTerm),
        purpose,
      })

      toast.success(`Application submitted: ${response.data.status}`)
      navigate("/customer/applications")
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to submit application"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-300">LoanAxis</p>
        <h1 className="text-3xl font-bold text-white">Apply for a loan</h1>
        <p className="mt-2 text-sm text-slate-400">
          Submit your loan request for automated eligibility and workflow review.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Loan application details</CardTitle>
          <CardDescription>
            Enter amount, term, type, and purpose for your request.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="loanType">Loan type</Label>
              <select
                id="loanType"
                value={loanType}
                onChange={(event) => setLoanType(event.target.value as LoanType)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
              >
                {loanTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="requestedAmount">Requested amount</Label>
                <Input
                  id="requestedAmount"
                  type="number"
                  min="1"
                  value={requestedAmount}
                  onChange={(event) => setRequestedAmount(event.target.value)}
                  placeholder="50000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedTerm">Term in months</Label>
                <Input
                  id="requestedTerm"
                  type="number"
                  min="1"
                  value={requestedTerm}
                  onChange={(event) => setRequestedTerm(event.target.value)}
                  placeholder="12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <textarea
                id="purpose"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                placeholder="Explain why you need this loan"
                required
                rows={5}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}