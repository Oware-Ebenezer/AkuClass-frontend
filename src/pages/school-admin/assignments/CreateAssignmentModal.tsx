import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { CATEGORY_LABEL } from '../../../constants/assignment';
import { useAsync } from '../../../hooks/useAsync';
import { createAssignment, publishAssignment } from '../../../services/assignmentService';
import { ApiError } from '../../../services/apiClient';
import { getClassSubjects } from '../../../services/classService';
import type { AssignmentCategory } from '../../../types/assignment';
import type { ClassListItem, ClassSubject } from '../../../types/class';

const categoryOptions = (Object.keys(CATEGORY_LABEL) as AssignmentCategory[]).map((v) => ({ value: v, label: CATEGORY_LABEL[v] }));
interface Props { open: boolean; classes: ClassListItem[]; onClose: () => void; onSaved: () => void; }

export function CreateAssignmentModal({ open, classes, onClose, onSaved }: Props) {
  const [classId, setClassId] = useState('');
  const [classSubjectId, setClassSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AssignmentCategory>('HOMEWORK');
  const [maxScore, setMaxScore] = useState('30');
  const [instructions, setInstructions] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [publishNow, setPublishNow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subjects = useAsync(useCallback(() => (open && classId ? getClassSubjects(classId) : Promise.resolve([] as ClassSubject[])), [open, classId]));

  useEffect(() => {
    if (!open) return;
    setClassId(''); setClassSubjectId(''); setTitle(''); setCategory('HOMEWORK'); setMaxScore('30'); setInstructions(''); setDueAt(''); setPublishNow(false); setError(null);
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const score = Number(maxScore);
    if (!classSubjectId) return setError('Choose a class and a subject.');
    if (!(score > 0)) return setError('Maximum score must be greater than 0.');
    setSaving(true); setError(null);
    try {
      const created = await createAssignment({ title: title.trim(), class_subject_id: classSubjectId, category, max_score: score, instructions: instructions.trim() || null, due_at: new Date(dueAt).toISOString() });
      if (publishNow) await publishAssignment(created.id);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to save this assignment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const subjectOptions = [
    { value: '', label: classId ? 'Select a subject' : 'Choose a class first' },
    ...(subjects.data ?? []).map((cs) => ({ value: cs.id, label: `${cs.subject.name}${cs.teacher ? ` — ${cs.teacher.full_name}` : ''}` })),
  ];
  const radio = 'flex flex-1 cursor-pointer items-start gap-2 rounded-lg border border-warm-200 p-3 text-sm has-[:checked]:border-teal has-[:checked]:bg-teal-pale';

  return (
    <Modal open={open} onClose={onClose} title="Create Assignment"
      footer={<><Button onClick={onClose} disabled={saving}>Cancel</Button><Button type="submit" form="create-assignment-form" variant="primary" disabled={saving}>{saving ? 'Saving…' : publishNow ? 'Save & Publish' : 'Save Draft'}</Button></>}>
      <form id="create-assignment-form" onSubmit={submit} className="space-y-4">
        <Input label="Title" required placeholder="e.g. Quadratic Equations Practice" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Class" options={[{ value: '', label: 'Select a class' }, ...classes.map((c) => ({ value: c.id, label: `${c.name} (${c.student_count} students)` }))]} value={classId} onChange={(e) => { setClassId(e.target.value); setClassSubjectId(''); }} />
          <Select label="Subject" options={subjectOptions} value={classSubjectId} onChange={(e) => setClassSubjectId(e.target.value)} disabled={!classId} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Category" options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value as AssignmentCategory)} />
          <Input label="Maximum score" type="number" min={1} step="any" required value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
        </div>
        <Input label="Due date and time" type="datetime-local" required value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        <div>
          <label htmlFor="assignment-instructions" className="mb-1 block text-xs font-semibold text-charcoal-lighter">Instructions</label>
          <textarea id="assignment-instructions" rows={4} placeholder="What should learners do, and how will it be marked?" value={instructions} onChange={(e) => setInstructions(e.target.value)}
            className="w-full rounded-lg border border-warm-200 bg-white p-3 text-sm placeholder:text-charcoal-muted focus:outline-2 focus:outline-teal" />
        </div>
        <fieldset className="flex flex-col gap-2 sm:flex-row">
          <legend className="mb-1 text-xs font-semibold text-charcoal-lighter">Publishing</legend>
          <label className={radio}><input type="radio" name="publish-mode" checked={!publishNow} onChange={() => setPublishNow(false)} className="mt-0.5 accent-teal" /><span><b className="block">Save as draft</b><span className="text-xs text-charcoal-muted">Visible to staff only</span></span></label>
          <label className={radio}><input type="radio" name="publish-mode" checked={publishNow} onChange={() => setPublishNow(true)} className="mt-0.5 accent-teal" /><span><b className="block">Publish now</b><span className="text-xs text-charcoal-muted">Visible to the class</span></span></label>
        </fieldset>
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      </form>
    </Modal>
  );
}
