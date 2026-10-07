import type { ClassTimetable, TimetableEntry, TimetableEntryPayload } from '../types/timetable';
import { USE_FIXTURES, apiDelete, apiGet, apiPatch, apiPost } from './apiClient';

const fx = () => import('./fixtures/timetable');

export async function getClassTimetable(classId: string): Promise<ClassTimetable> {
  if (USE_FIXTURES) return (await fx()).getTimetable(classId);
  return apiGet<ClassTimetable>(`/classes/${encodeURIComponent(classId)}/timetable`);
}

export async function createTimetableEntry(payload: TimetableEntryPayload): Promise<TimetableEntry> {
  if (USE_FIXTURES) return (await fx()).addEntry(payload);
  return apiPost<TimetableEntry>('/timetable', payload);
}

export async function updateTimetableEntry(id: string, payload: TimetableEntryPayload): Promise<TimetableEntry> {
  if (USE_FIXTURES) return (await fx()).updateEntry(id, payload);
  return apiPatch<TimetableEntry>(`/timetable/${encodeURIComponent(id)}`, payload);
}

export async function deleteTimetableEntry(id: string): Promise<void> {
  if (USE_FIXTURES) return (await fx()).removeEntry(id);
  return apiDelete(`/timetable/${encodeURIComponent(id)}`);
}
