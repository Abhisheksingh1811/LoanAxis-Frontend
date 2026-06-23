import axiosClient from "./axiosClient"

export type LoanType = "PERSONAL" | "VEHICLE" | "MORTGAGE" | "EDUCATION"

export type LoanApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "AUTO_REJECTED"
  | "CANCELLED"

export type OfficerApplicationCustomer = {
  fullName: string
  creditScore: number
  monthlyIncome: number
}

export type OfficerApplicationResponse = {
  id: number
  customer: OfficerApplicationCustomer
  loanType: LoanType
  requestedAmount: number
  dtiRatio: number
  status: LoanApplicationStatus
  createdAt: string
}

export type OfficerApplicationsPageResponse = {
  content: OfficerApplicationResponse[]
  totalElements: number
  totalPages: number
  pageSize: number
  pageNumber: number
  isFirst: boolean
  isLast: boolean
}

export type ApproveLoanApplicationResponse = {
  loanId: number
  principalAmount: number
  termMonths: number
  monthlyInstallment: number
  totalAmount: number
  disbursementDate: string
  maturityDate: string
}

export const officerApi = {
  getApplications: (status?: LoanApplicationStatus, page = 0, size = 20) =>
    axiosClient.get<OfficerApplicationsPageResponse>("/api/officer/applications", {
      params: {
        page,
        size,
        sortBy: "id",
        direction: "DESC",
        ...(status ? { status } : {}),
      },
    }),

  approveApplication: (applicationId: number) =>
    axiosClient.put<ApproveLoanApplicationResponse>(
      `/api/officer/applications/${applicationId}/approve`
    ),

    rejectApplication: (applicationId: number, rejectionReason: string) =>
    axiosClient.delete<void>(`/api/officer/applications/${applicationId}/reject`, {
      data: JSON.stringify(rejectionReason),
      headers: {
        "Content-Type": "application/json",
      },
    }),
}