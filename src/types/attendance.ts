import type { AttendanceStatus } from './index';
import type { Gender } from './student';

// PROPOSED shapes. The contract defines the attendance endpoints but not their bodies, and has
// no endpoint that lists a session's records, so records are assumed embedded in the session.
export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_number: string;
  full_name: string;
  photo_url: string | null;
  gender: Gender;
  status: AttendanceStatus;
  arrival_time: string | null; // "HH:mm"
  note: string | null;
}

export interface AttendanceSession {
  id: string;
  class_id: string;
  class_name: string;
  date: string; // YYYY-MM-DD
  label: string;
  recorded_by: { id: string; full_name: string } | null;
  submitted_at: string;
  summary: { enrolled: number; present: number; absent: number; late: number; excused: number };
  records: AttendanceRecord[];
}

export interface UpdateRecordPayload { status: AttendanceStatus; arrival_time: string | null; note: string | null; }
