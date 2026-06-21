import { Navigate, Route, Routes } from "react-router-dom";
import PortalLayout from "@/components/layout/PortalLayout";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireRole from "@/components/auth/RequireRole";
import LoginPage from "@/pages/Login/LoginPage";
import EmployeeDashboardPage from "@/pages/Dashboard/EmployeeDashboardPage";
import ExamInstructionsPage from "@/pages/Exam/ExamInstructionsPage";
import ExamSessionPage from "@/pages/Exam/ExamSessionPage";
import ExamReviewPage from "@/pages/Exam/ExamReviewPage";
import ResultPage from "@/pages/Result/ResultPage";
import CertificatePage from "@/pages/Certificate/CertificatePage";
import HistoryPage from "@/pages/History/HistoryPage";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import UserManagementPage from "@/pages/Admin/UserManagementPage";
import QuestionBankPage from "@/pages/Admin/QuestionBankPage";
import ExamManagementPage from "@/pages/Admin/ExamManagementPage";
import LiveMonitoringPage from "@/pages/Admin/LiveMonitoringPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<PortalLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboardPage />} />
          <Route path="exam/instructions" element={<ExamInstructionsPage />} />
          <Route path="exam/session" element={<ExamSessionPage />} />
          <Route path="exam/review" element={<ExamReviewPage />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="certificate" element={<CertificatePage />} />
          <Route path="history" element={<HistoryPage />} />

          <Route element={<RequireRole allowed={["ADMIN", "SUPER_ADMIN"]} />}>
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="admin/users" element={<UserManagementPage />} />
            <Route path="admin/question-bank" element={<QuestionBankPage />} />
            <Route path="admin/exams" element={<ExamManagementPage />} />
            <Route path="admin/live-monitoring" element={<LiveMonitoringPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
