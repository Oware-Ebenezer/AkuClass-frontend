import type { AttendanceRecord, AttendanceSession, UpdateRecordPayload } from '../types/attendance';
import { toQuery } from '../utils/query';
import { USE_FIXTURES, apiGetPage, apiPatch } from './apiClient';

export async function getAttendanceSession(params: { class_id: string; date: string }): Promise<AttendanceSession | null> {
  if (USE_FIXTURES) return (await import('./fixtures/attendance')).findSession(params);
  const res = await apiGetPage<AttendanceSession>(`/attendance/sessions${toQuery({ ...params, page: 1, page_size: 1 })}`);
  return res.data[0] ?? null;
}

export async function updateAttendanceRecord(recordId: string, payload: UpdateRecordPayload): Promise<AttendanceRecord> {
  if (USE_FIXTURES) return (await import('./fixtures/attendance')).patchRecord(recordId, payload);
  return apiPatch<AttendanceRecord>(`/attendance/records/${encodeURIComponent(recordId)}`, payload);
}
