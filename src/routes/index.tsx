import { Navigate, Route, Routes } from 'react-router-dom';
import SchoolAdminLayout from '../layouts/SchoolAdminLayout';
import AttendancePage from '../pages/school-admin/attendance/AttendancePage';
import ClassesPage from '../pages/school-admin/classes/ClassesPage';
import StudentsPage from '../pages/school-admin/students/StudentsPage';
import StudentProfilePage from '../pages/school-admin/students/StudentProfilePage';
import DashboardPage from '../pages/school-admin/DashboardPage';
import { PageContainer } from '../components/layout/PageContainer';
import TeachersPage from '../pages/school-admin/teachers/TeachersPage';

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
        <Route path="students" element={<StudentsPage />} />
        <Route path="students/:studentId" element={<StudentProfilePage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="teachers" element={<TeachersPage/>} />
        <Route path="*" element={<NotBuiltYet />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}
