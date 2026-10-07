import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { ApiError } from '../../../services/apiClient';
import { saveResult } from '../../../services/resultService';
import type { ResultContext, ResultRow } from '../../../types/result';

interface Props { row: ResultRow | null; ctx: ResultContext | null; subjectName: string; onClose: () => void; onSaved: () => void; }

export function EnterResultModal({ row, ctx, subjectName, onClose, onSaved }: Props) {
  const [continuous, setContinuous] = useState('');
  const [exam, setExam] = useState('');
  const [remark, setRemark] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!row) return;
    setContinuous(row.continuous_score === null ? '' : String(row.continuous_score));
    setExam(row.exam_score === null ? '' : String(row.exam_score));
    setRemark(row.remark ?? ''); setError(null);
  }, [row]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!row || !ctx) return;
    const c = Number(continuous);
    const x = Number(exam);
    if (continuous === '' || !(c >= 0 && c <= row.continuous_max)) return setError(`Class assessment must be between 0 and ${row.continuous_max}.`);
    if (exam === '' || !(x >= 0 && x <= row.exam_max)) return setError(`Terminal exam must be between 0 and ${row.exam_max}.`);
    setSaving(true); setError(null);
    try { await saveResult(ctx, row.student_id, row.result_id, { continuous_score: c, exam_score: x, remark: remark.trim() || null }); onSaved(); }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Unable to save this result. Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={!!row} onClose={onClose} title={row ? `${row.result_id ? 'Edit' : 'Enter'} result · ${row.full_name}` : 'Enter result'}
      footer={<><Button onClick={onClose} disabled={saving}>Cancel</Button><Button type="submit" form="result-form" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save Result'}</Button></>}>
      {row && (
        <form id="result-form" onSubmit={submit} className="space-y-4">
          <p className="text-xs text-charcoal-muted">{row.student_number} · {subjectName}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label={`Class assessment (out of ${row.continuous_max})`} type="number" min={0} max={row.continuous_max} step="any" required value={continuous} onChange={(e) => setContinuous(e.target.value)} />
            <Input label={`Terminal exam (out of ${row.exam_max})`} type="number" min={0} max={row.exam_max} step="any" required value={exam} onChange={(e) => setExam(e.target.value)} />
          </div>
          <p className="rounded-lg bg-warm-100 p-3 text-xs text-charcoal-lighter">The total and grade are calculated by the system when you save.</p>
          <div>
            <label htmlFor="result-remark" className="mb-1 block text-xs font-semibold text-charcoal-lighter">Teacher’s remark</label>
            <textarea id="result-remark" rows={3} maxLength={200} placeholder="Optional" value={remark} onChange={(e) => setRemark(e.target.value)}
              className="w-full rounded-lg border border-warm-200 bg-white p-3 text-sm placeholder:text-charcoal-muted focus:outline-2 focus:outline-teal" />
          </div>
          {error && <p role="alert" className="text-xs text-danger">{error}</p>}
        </form>
      )}
    </Modal>
  );
}
