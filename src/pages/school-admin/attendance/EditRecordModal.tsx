import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { ATTENDANCE_LABEL, ATTENDANCE_ORDER } from '../../../constants/attendance';
import { ApiError } from '../../../services/apiClient';
import { updateAttendanceRecord } from '../../../services/attendanceService';
import type { AttendanceStatus } from '../../../types';
import type { AttendanceRecord } from '../../../types/attendance';

interface Props { record: AttendanceRecord | null; onClose: () => void; onSaved: () => void; }

const options = ATTENDANCE_ORDER.map((s) => ({ value: s, label: ATTENDANCE_LABEL[s] }));

export function EditRecordModal({ record, onClose, onSaved }: Props) {
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!record) return;
    setStatus(record.status); setTime(record.arrival_time ?? ''); setNote(record.note ?? ''); setError(null);
  }, [record]);

  const hasArrival = status === 'PRESENT' || status === 'LATE';

  const save = async () => {
    if (!record) return;
    setSaving(true); setError(null);
    try {
      await updateAttendanceRecord(record.id, { status, arrival_time: hasArrival && time ? time : null, note: note.trim() || null });
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Unable to save this change. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={!!record} onClose={onClose} title={record ? `Edit attendance · ${record.full_name}` : 'Edit attendance'}
      footer={<><Button onClick={onClose} disabled={saving}>Cancel</Button><Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button></>}>
      <div className="space-y-4">
        <Select label="Status" options={options} value={status} onChange={(e) => setStatus(e.target.value as AttendanceStatus)} />
        {hasArrival && <Input label="Arrival time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />}
        <Input label="Notes" maxLength={200} placeholder="Optional" value={note} onChange={(e) => setNote(e.target.value)} />
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      </div>
    </Modal>
  );
}
