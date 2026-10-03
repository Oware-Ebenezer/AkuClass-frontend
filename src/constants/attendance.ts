import type { AttendanceStatus } from '../types';

export const ATTENDANCE_LABEL: Record<AttendanceStatus, string> = { PRESENT: 'Present', ABSENT: 'Absent', LATE: 'Late', EXCUSED: 'Excused' };
export const ATTENDANCE_TONE = { PRESENT: 'teal', ABSENT: 'danger', LATE: 'orange', EXCUSED: 'neutral' } as const;
export const ATTENDANCE_BAR: Record<AttendanceStatus, string> = { PRESENT: 'bg-teal', ABSENT: 'bg-danger', LATE: 'bg-orange', EXCUSED: 'bg-charcoal-muted' };
export const ATTENDANCE_ORDER: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];
