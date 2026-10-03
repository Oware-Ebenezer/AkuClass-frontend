import type { DashboardSummary } from '../../types';

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

// Dev-only data mirroring the approved Stitch screen. Remove once the endpoint is live.
export const dashboardFixture = (): DashboardSummary => ({
  term: { name: 'Term 1', week: 4, inSession: true },
  students: { total: 842, enrolledThisTerm: 18 },
  teachers: { total: 48, newThisYear: 3 },
  classes: { total: 24, jhs: 12, shs: 12 },
  attendanceToday: {
    date: '2026-10-01', enrolled: 842, present: 796, absent: 24, late: 15, excused: 7, targetPercent: 95,
    jhs: { enrolled: 426, present: 408 }, shs: { enrolled: 416, present: 388 },
  },
  announcements: [
    { id: 'a1', title: 'Term 1 Continuous Assessment Schedule', category: 'academics', author: 'Academic Office',
      summary: 'Timetable and guidelines for Class Tests & Mid-Term Submissions across all departments.',
      publishedAt: '2026-09-30', audience: 'JHS 1-3 & SHS 1-3' },
    { id: 'a2', title: 'JHS 3 Mock Examination Preparation', category: 'examination', author: 'Academic Office',
      summary: 'Supervisors assigned for Pre-BECE series 1. Hall seatings finalized in the Assembly Complex.',
      publishedAt: '2026-09-28', audience: 'JHS 3 Candidates' },
    { id: 'a3', title: 'Parents and Teachers Association (PTA) Meeting', category: 'general', author: 'School Administration',
      summary: 'General session regarding academic welfare, laboratory expansion levy, and boarding facilities.',
      publishedAt: '2026-09-25', audience: 'All Stakeholders' },
  ],
  events: [
    { id: 'e1', title: 'Math Department Meeting', startsAt: '2026-10-05T14:00:00', location: 'Staff Common Room' },
    { id: 'e2', title: 'JHS 3 Mock Examination', startsAt: '2026-10-08T08:00:00', location: 'Assembly Hall' },
    { id: 'e3', title: 'PTA General Assembly', startsAt: '2026-10-10T09:00:00', location: 'Main Auditorium' },
    { id: 'e4', title: 'SHS Career Guidance', startsAt: '2026-10-14T13:00:00', location: 'Library Annex' },
  ],
  activity: [
    { id: 'r1', title: 'New student registered', description: 'Kwame Asante admitted to JHS 2A', highlight: 'JHS 2A', occurredAt: ago(10) },
    { id: 'r2', title: 'Attendance updated', description: 'Submitted for SHS 1 General Science', highlight: 'SHS 1 General Science', occurredAt: ago(32) },
    { id: 'r3', title: 'Announcement published', description: 'Continuous Assessment guidelines sent by Academic Office', highlight: 'Academic Office', occurredAt: ago(60) },
    { id: 'r4', title: 'Teacher profile added', description: 'Emmanuel Osei assigned to Mathematics Dept', highlight: 'Mathematics Dept', occurredAt: ago(120) },
  ],
});
