import type { AttendanceRecord, AttendanceSession, UpdateRecordPayload } from '../../types/attendance';
import type { AttendanceStatus } from '../../types';
import { todayIso } from '../../utils/format';
import { ApiError } from '../apiClient';
import { queryClasses } from './classes';
import { studentsFixture } from './students';

// Dev-only: deterministic roll calls for weekdays up to today; edits live in memory.
const overrides = new Map<string, Partial<AttendanceRecord>>();
const delay = () => new Promise((r) => setTimeout(r, 200));
const pad = (n: number) => String(n).padStart(2, '0');

const isSchoolDay = (date: string) => {
  const day = new Date(`${date}T00:00:00`).getDay();
  return day !== 0 && day !== 6 && date <= todayIso();
};

export async function findSession({ class_id, date }: { class_id: string; date: string }): Promise<AttendanceSession | null> {
  await delay();
  if (!isSchoolDay(date)) return null;
  const cls = (await queryClasses({ page: 1, page_size: 100 })).data.find((c) => c.id === class_id);
  if (!cls) return null;
  const dayKey = Number(date.replaceAll('-', '')) % 97;

  const records: AttendanceRecord[] = studentsFixture
    .filter((s) => s.class_id === class_id && s.status === 'ACTIVE')
    .sort((a, b) => a.full_name.localeCompare(b.full_name))
    .map((s, i) => {
      const seed = (Number(s.student_number.slice(-5)) * 7 + dayKey * 3 + i) % 40;
      const status: AttendanceStatus = seed < 2 ? 'ABSENT' : seed === 2 ? 'LATE' : seed === 3 ? 'EXCUSED' : 'PRESENT';
      const base: AttendanceRecord = {
        id: `${class_id}:${date}:${s.id}`, student_id: s.id, student_number: s.student_number, full_name: s.full_name,
        photo_url: s.photo_url, gender: s.gender, status,
        arrival_time: status === 'PRESENT' ? `07:${pad(30 + (seed % 25))}` : status === 'LATE' ? `08:${pad(10 + (seed % 20))}` : null,
        note: status === 'LATE' ? 'Arrived after roll call began' : null,
      };
      return { ...base, ...overrides.get(base.id) };
    });

  const count = (st: AttendanceStatus) => records.filter((r) => r.status === st).length;
  return {
    id: `${class_id}:${date}`, class_id, class_name: cls.name, date, label: 'Morning Roll Call',
    recorded_by: cls.class_teacher, submitted_at: `${date}T08:22:00`,
    summary: { enrolled: records.length, present: count('PRESENT'), absent: count('ABSENT'), late: count('LATE'), excused: count('EXCUSED') },
    records,
  };
}

export async function patchRecord(id: string, payload: UpdateRecordPayload): Promise<AttendanceRecord> {
  const [class_id, date] = id.split(':');
  overrides.set(id, payload);
  const record = (await findSession({ class_id, date }))?.records.find((r) => r.id === id);
  if (!record) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Attendance record was not found.');
  return record;
}
