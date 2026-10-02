export interface NavItem { label: string; path: string; icon: string; }

export const SCHOOL_ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/app/dashboard', icon: 'dashboard' },
  { label: 'Students', path: '/app/students', icon: 'school' },
  { label: 'Teachers', path: '/app/teachers', icon: 'person_apron' },
  { label: 'Classes', path: '/app/classes', icon: 'meeting_room' },
  { label: 'Subjects', path: '/app/subjects', icon: 'menu_book' },
  { label: 'Assignments', path: '/app/assignments', icon: 'assignment' },
  { label: 'Attendance', path: '/app/attendance', icon: 'fact_check' },
  { label: 'Results', path: '/app/results', icon: 'grade' },
  { label: 'Timetable', path: '/app/timetable', icon: 'schedule' },
  { label: 'Announcements', path: '/app/announcements', icon: 'campaign' },
  { label: 'Notifications', path: '/app/notifications', icon: 'notifications' },
  { label: 'Settings', path: '/app/settings', icon: 'settings' },
];
