import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { DAYS } from '../../../constants/timetable';
import { useAsync } from '../../../hooks/useAsync';
import { ApiError } from '../../../services/apiClient';
import { getClassSubjects } from '../../../services/classService';
import { createTimetableEntry, deleteTimetableEntry, updateTimetableEntry } from '../../../services/timetableService';
import type { ClassSubject } from '../../../types/class';
import type { Period, TimetableEntry } from '../../../types/timetable';

export interface EditorState { entry?: TimetableEntry; day?: number; periodId?: string; }
interface Props { editor: EditorState | null; classId: string; periods: Period[]; onClose: () => void; onSaved: () => void; }

export function TimetableEntryModal({ editor, classId, periods, onClose, onSaved }: Props) {
  const open = editor !== null;
  const lessons = periods.filter((p) => p.kind === 'LESSON');
  const [day, setDay] = useState(1);
  const [periodId, setPeriodId] = useState('');
  const [csId, setCsId] = useState('');
  const [room, setRoom] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subjects = useAsync(useCallback((): Promise<ClassSubject[]> => (open && classId ? getClassSubjects(classId) : Promise.resolve([])), [open, classId]));

  useEffect(() => {
    if (!editor) return;
    setDay(editor.entry?.day ?? editor.day ?? 1); setPeriodId(editor.entry?.period_id ?? editor.periodId ?? lessons[0]?.id ?? '');
    setCsId(editor.entry?.class_subject_id ?? ''); setRoom(editor.entry?.room ?? ''); setConfirmRemove(false); setError(null);
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true); setError(null);
    try { await fn(); onSaved(); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!csId) return setError('Choose a subject.');
    const payload = { class_id: classId, class_subject_id: csId, day, period_id: periodId, room: room.trim() || null };
    run(() => (editor?.entry ? updateTimetableEntry(editor.entry.id, payload) : createTimetableEntry(payload)));
  };

  const isEdit = Boolean(editor?.entry);
  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
      footer={<>
        {isEdit && (confirmRemove
          ? <Button className="mr-auto" disabled={busy} onClick={() => run(() => deleteTimetableEntry(editor!.entry!.id))}>Confirm remove</Button>
          : <button type="button" className="mr-auto inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-pale" onClick={() => setConfirmRemove(true)}><Icon name="delete" size={16} />Remove lesson</button>)}
        <Button onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" form="timetable-form" variant="primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
      </>}>
      <form id="timetable-form" onSubmit={submit} className="space-y-4">
        {editor?.entry?.conflict && (
          <p className="flex items-start gap-2 rounded-lg bg-danger-pale p-3 text-xs text-danger"><Icon name="warning" size={18} className="shrink-0" />{editor.entry.conflict}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Select label="Day" options={DAYS.map((d) => ({ value: String(d.value), label: d.label }))} value={String(day)} onChange={(e) => setDay(Number(e.target.value))} />
          <Select label="Period" options={lessons.map((p) => ({ value: p.id, label: `${p.label} (${p.start})` }))} value={periodId} onChange={(e) => setPeriodId(e.target.value)} />
        </div>
        <Select label="Subject & Teacher" options={[{ value: '', label: 'Select a subject' }, ...(subjects.data ?? []).map((s) => ({ value: s.id, label: `${s.subject.name}${s.teacher ? ` — ${s.teacher.full_name}` : ''}` }))]} value={csId} onChange={(e) => setCsId(e.target.value)} />
        <Input label="Room" placeholder="Optional" maxLength={40} value={room} onChange={(e) => setRoom(e.target.value)} />
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      </form>
    </Modal>
  );
}
