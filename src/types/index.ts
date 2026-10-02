export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AttendanceBreakdown {
  enrolled: number;
  present: number;
}

export interface AttendanceToday {
  date: string; // ISO date
  enrolled: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  targetPercent: number;
  jhs: AttendanceBreakdown;
  shs: AttendanceBreakdown;
}

export type AnnouncementCategory = 'academics' | 'examination' | 'general';

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  category: AnnouncementCategory;
  author: string;
  publishedAt: string;
  audience: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  startsAt: string;
  location: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  highlight?: string; // portion of the description emphasised in the UI
  occurredAt: string;
}

export interface DashboardSummary {
  term: { name: string; week: number; inSession: boolean };
  students: { total: number; enrolledThisTerm: number };
  teachers: { total: number; newThisYear: number };
  classes: { total: number; jhs: number; shs: number };
  attendanceToday: AttendanceToday;
  announcements: Announcement[];
  events: SchoolEvent[];
  activity: ActivityItem[];
}
