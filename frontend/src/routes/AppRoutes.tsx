import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../domains/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/Layout/MainLayout';
import { DashboardPage } from '../domains/dashboard/DashboardPage';
import { StudentsPage } from '../domains/students/StudentsPage';
import { NoticesPage } from '../domains/notices/NoticesPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="notices" element={<NoticesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

