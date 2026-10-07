import { Navigate, Route, Routes } from 'react-router-dom';
import SchoolAdminLayout from '../layouts/SchoolAdminLayout';
import AttendancePage from '../pages/school-admin/attendance/AttendancePage';
import ClassesPage from '../pages/school-admin/classes/ClassesPage';
import StudentsPage from '../pages/school-admin/students/StudentsPage';
import StudentProfilePage from '../pages/school-admin/students/StudentProfilePage';
import DashboardPage from '../pages/school-admin/DashboardPage';
import { PageContainer } from '../components/layout/PageContainer';
import TeachersPage from '../pages/school-admin/teachers/TeachersPage';
import ClassDetailPage from '../pages/school-admin/classes/ClassDetailPage';
import TeacherProfilePage from '../pages/school-admin/teachers/TeacherProfilePage';
import SubjectsPage from '../pages/school-admin/subjects/SubjectsPage';
import AssignmentsPage from '../pages/school-admin/assignments/AssignmentsPage';
import AssignmentDetailPage from '../pages/school-admin/assignments/AssignmentDetailPage';
import ResultsPage from '../pages/school-admin/results/ResultsPage';
import TimetablePage from '../pages/school-admin/timetable/TimetablePage';

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
        <Route path="classes/:classId" element= {<ClassDetailPage/>} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="assignments/:assignmentId" element={<AssignmentDetailPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="results" element={<ResultsPage/>} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="teachers" element={<TeachersPage/>} />
        <Route path="teachers/:teacherId" element={<TeacherProfilePage />} />
        <Route path="*" element={<NotBuiltYet />} />
        <Route path="subjects" element={<SubjectsPage/>} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}
