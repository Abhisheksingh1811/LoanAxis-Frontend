import axiosClient from "./axiosClient"

export type LoanType = "PERSONAL" | "VEHICLE" | "MORTGAGE" | "EDUCATION"

export type LoanApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "AUTO_REJECTED"
  | "CANCELLED"

export type CreateLoanApplicationRequest = {
  loanType: LoanType
  requestedAmount: number
  requestedTerm: number
  purpose: string
}

export type CreateLoanApplicationResponse = {
  id: number
  loanType: LoanType
  requestedAmount: number
  requestedTerm: number
  monthlyInstallment: number
  interestRate: number
  totalPayment: number
  dtiRatio: number
  status: LoanApplicationStatus
  rejectionReasons: string[] | null
  createdAt: string
}

export type CustomerApplicationResponse = {
  id: number
  loanType: LoanType
  requestedAmount: number
  status: LoanApplicationStatus
  createdAt: string
}

export const applicationApi = {
  create: (data: CreateLoanApplicationRequest) =>
    axiosClient.post<CreateLoanApplicationResponse>("/api/applications", data),

  getMyApplications: (status?: LoanApplicationStatus) =>
    axiosClient.get<CustomerApplicationResponse[]>("/api/applications/my", {
      params: status ? { status } : undefined,
    }),

  getById: (applicationId: number) =>
    axiosClient.get<CustomerApplicationResponse>(
      `/api/applications/${applicationId}`
    ),

  deleteById: (applicationId: number) =>
    axiosClient.delete(`/api/applications/${applicationId}`),
}