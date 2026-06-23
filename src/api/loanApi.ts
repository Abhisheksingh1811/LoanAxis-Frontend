import axiosClient from "./axiosClient"

export type LoanType = "PERSONAL" | "VEHICLE" | "MORTGAGE" | "EDUCATION"

export type LoanStatusType = "ACTIVE" | "PAID_OFF" | "DEFAULTED" | "CANCELLED"

export type InstallmentStatus = "PENDING" | "PAID" | "OVERDUE"

export type MyLoanResponse = {
  id: number
  loanType: LoanType
  principalAmount: number
  interestRate: number
  termMonths: number
  monthlyInstallment: number
  status: LoanStatusType
  remainingBalance: number
  paidInstallments: number
  nextDueDate: string | null
  disbursementDate: string
  maturityDate: string
}

export type LoanInstallmentView = {
  id?: number
  installmentNumber: number
  dueDate: string
  amount: number
  principalAmount: number
  interestAmount: number
  status: InstallmentStatus
  paidDate: string | null
}

export type LoanDetailsResponse = {
  id: number
  principalAmount: number
  remainingBalance: number
  installments: LoanInstallmentView[]
}

export type PayInstallmentRequest = {
  amount: number
  paymentMethod: string
}

export type PayInstallmentResponse = {
  installmentNumber: number
  amount: number
  paidDate: string
  remainingBalance: number
  nextDueDate: string | null
}

export const loanApi = {
  getMyLoans: () => axiosClient.get<MyLoanResponse[]>("/api/loans/my"),

  getById: (loanId: number) =>
    axiosClient.get<LoanDetailsResponse>(`/api/loans/my/${loanId}`),

  payInstallment: (
    loanId: number,
    installmentId: number,
    data: PayInstallmentRequest
  ) =>
    axiosClient.post<PayInstallmentResponse>(
      `/api/loans/${loanId}/installments/${installmentId}/pay`,
      data
    ),
}