import { Navigate, Route, Routes } from 'react-router-dom';
import SchoolAdminLayout from '../layouts/SchoolAdminLayout';
import DashboardPage from '../pages/school-admin/DashboardPage';
import { PageContainer } from '../components/layout/PageContainer';

function NotBuiltYet() {
  return <PageContainer title="Not available yet" description="This screen has not been implemented." />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="app" element={<SchoolAdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotBuiltYet />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}
