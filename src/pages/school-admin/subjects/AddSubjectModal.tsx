import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { CATEGORY_LABEL } from '../../../constants/subject';
import { ApiError } from '../../../services/apiClient';
import { createSubject } from '../../../services/subjectService';
import type { SubjectCategory, SubjectLevel } from '../../../types/subject';

const levelOptions = [{ value: 'JHS', label: 'JHS' }, { value: 'SHS', label: 'SHS' }, { value: 'BOTH', label: 'JHS & SHS' }];
const categoryOptions = (Object.keys(CATEGORY_LABEL) as SubjectCategory[]).map((v) => ({ value: v, label: CATEGORY_LABEL[v] }));

interface Props { open: boolean; onClose: () => void; onSaved: () => void; }

export function AddSubjectModal({ open, onClose, onSaved }: Props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState<SubjectLevel>('JHS');
  const [category, setCategory] = useState<SubjectCategory>('CORE');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(''); setCode(''); setLevel('JHS'); setCategory('CORE'); setDescription(''); setError(null);
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await createSubject({ name: name.trim(), code: code.trim().toUpperCase(), level, category, description: description.trim() || null });
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to save this subject. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Subject"
      footer={<><Button onClick={onClose} disabled={saving}>Cancel</Button><Button type="submit" form="add-subject-form" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save Subject'}</Button></>}>
      <form id="add-subject-form" onSubmit={submit} className="space-y-4">
        <Input label="Subject name" required placeholder="e.g. Geography" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Subject code" required maxLength={12} placeholder="e.g. GEO" value={code} onChange={(e) => setCode(e.target.value)} />
          <Select label="School level" options={levelOptions} value={level} onChange={(e) => setLevel(e.target.value as SubjectLevel)} />
        </div>
        <Select label="Category" options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value as SubjectCategory)} />
        <div>
          <label htmlFor="subject-description" className="mb-1 block text-xs font-semibold text-charcoal-lighter">Description</label>
          <textarea id="subject-description" rows={2} maxLength={200} placeholder="Optional" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-warm-200 bg-white p-3 text-sm placeholder:text-charcoal-muted focus:outline-2 focus:outline-teal" />
        </div>
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      </form>
    </Modal>
  );
}
