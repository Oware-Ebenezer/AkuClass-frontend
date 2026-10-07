import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Modal } from '../../../../components/ui/Modal';
import { ApiError } from '../../../../services/apiClient';
import { gradeSubmission } from '../../../../services/assignmentService';
import type { SubmissionRow } from '../../../../types/assignment';
import { formatDateTime } from '../../../../utils/format';

interface Props { maxScore: number; row: SubmissionRow | null; onClose: () => void; onSaved: () => void; }

export function GradeSubmissionModal({ maxScore, row, onClose, onSaved }: Props) {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!row) return;
    setScore(row.score === null ? '' : String(row.score)); setFeedback(row.feedback ?? ''); setError(null);
  }, [row]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!row) return;
    const value = Number(score);
    if (score === '' || !(value >= 0 && value <= maxScore)) return setError(`Enter a score between 0 and ${maxScore}.`);
    setSaving(true); setError(null);
    try { await gradeSubmission(row.id, { score: value, feedback: feedback.trim() || null }); onSaved(); }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Unable to save this grade. Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={!!row} onClose={onClose} title={row ? `${row.graded ? 'Review' : 'Grade'} · ${row.full_name}` : 'Grade submission'}
      footer={<><Button onClick={onClose} disabled={saving}>Cancel</Button><Button type="submit" form="grade-form" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save Grade'}</Button></>}>
      {row && (
        <form id="grade-form" onSubmit={submit} className="space-y-4">
          <p className="text-xs text-charcoal-muted">{row.student_number}{row.submitted_at && <> · Submitted {formatDateTime(row.submitted_at)}</>}</p>
          <Input label={`Score (out of ${maxScore})`} type="number" min={0} max={maxScore} step="any" required value={score} onChange={(e) => setScore(e.target.value)} />
          <div>
            <label htmlFor="grade-feedback" className="mb-1 block text-xs font-semibold text-charcoal-lighter">Feedback</label>
            <textarea id="grade-feedback" rows={3} maxLength={500} placeholder="Optional" value={feedback} onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-lg border border-warm-200 bg-white p-3 text-sm placeholder:text-charcoal-muted focus:outline-2 focus:outline-teal" />
          </div>
          {error && <p role="alert" className="text-xs text-danger">{error}</p>}
        </form>
      )}
    </Modal>
  );
}
