import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RoleRoute } from "@/routes/RoleRoute"

import LandingPage from "@/pages/public/LandingPage"
import LoginPage from "@/pages/public/LoginPage"
import RegisterPage from "@/pages/public/RegisterPage"
import NotFoundPage from "@/pages/public/NotFoundPage"

import CustomerDashboardPage from "@/pages/customer/CustomerDashboardPage"
import ApplyLoanPage from "@/pages/customer/ApplyLoanPage"
import MyApplicationsPage from "@/pages/customer/MyApplicationsPage"
import ApplicationDetailsPage from "@/pages/customer/ApplicationDetailsPage"
import MyLoansPage from "@/pages/customer/MyLoansPage"
import LoanDetailsPage from "@/pages/customer/LoanDetailsPage"
import LoginHistoryPage from "@/pages/customer/LoginHistoryPage"
import CustomerSettingsPage from "@/pages/customer/CustomerSettingsPage"

import OfficerDashboardPage from "@/pages/officer/OfficerDashboardPage"
import OfficerApplicationsPage from "@/pages/officer/OfficerApplicationsPage"
import OfficerApplicationDetailsPage from "@/pages/officer/OfficerApplicationDetailsPage"
import OfficerLoginHistoryPage from "@/pages/officer/OfficerLoginHistoryPage"

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage"
import AuditLogsPage from "@/pages/admin/AuditLogsPage"
import UserSecurityPage from "@/pages/admin/UserSecurityPage"

import CustomerLayout from "@/layouts/CustomerLayout"

import OfficerLayout from "@/layouts/OfficerLayout"

import AdminLayout from "@/layouts/AdminLayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/customer"
          element={
            <RoleRoute allowedRoles={["ROLE_CUSTOMER"]}>
              <CustomerLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="apply" element={<ApplyLoanPage />} />
          <Route path="applications" element={<MyApplicationsPage />} />
          <Route path="applications/:applicationId" element={<ApplicationDetailsPage />} />
          <Route path="loans" element={<MyLoansPage />} />
          <Route path="loans/:loanId" element={<LoanDetailsPage />} />
          <Route path="login-history" element={<LoginHistoryPage />} />
          <Route path="settings" element={<CustomerSettingsPage />} />
        </Route>

        <Route
  path="/officer"
  element={
    <RoleRoute allowedRoles={["ROLE_CREDIT_OFFICER", "ROLE_ADMIN"]}>
      <OfficerLayout />
    </RoleRoute>
  }
>
  <Route path="dashboard" element={<OfficerDashboardPage />} />
  <Route path="applications" element={<OfficerApplicationsPage />} />
  <Route path="applications/:applicationId" element={<OfficerApplicationDetailsPage />} />
  <Route path="security-activity" element={<OfficerLoginHistoryPage />} />
</Route>

<Route
  path="/admin"
  element={
    <RoleRoute allowedRoles={["ROLE_ADMIN"]}>
      <AdminLayout />
    </RoleRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboardPage />} />
  <Route path="audit-logs" element={<AuditLogsPage />} />
  <Route path="user-security" element={<UserSecurityPage />} />
</Route>
<Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}