import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { AUDIENCE_LABEL } from '../../../constants/announcement';
import { ApiError } from '../../../services/apiClient';
import { publishAnnouncement, saveAnnouncement } from '../../../services/announcementService';
import type { AnnouncementAudience, AnnouncementDetail } from '../../../types/announcement';
import type { ClassListItem } from '../../../types/class';

export interface FormEditor { announcement?: AnnouncementDetail; }
interface Props { editor: FormEditor | null; classes: ClassListItem[]; onClose: () => void; onSaved: () => void; }

const audienceOptions = (Object.keys(AUDIENCE_LABEL) as AnnouncementAudience[]).map((v) => ({ value: v, label: AUDIENCE_LABEL[v] }));

export function AnnouncementFormModal({ editor, classes, onClose, onSaved }: Props) {
  const existing = editor?.announcement;
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState<AnnouncementAudience>('ENTIRE_SCHOOL');
  const [classId, setClassId] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;
    setTitle(existing?.title ?? ''); setAudience(existing?.audience ?? 'ENTIRE_SCHOOL'); setClassId(existing?.class?.id ?? ''); setBody(existing?.body ?? ''); setError(null);
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (publish: boolean) => {
    if (!formRef.current?.reportValidity()) return;
    if (audience === 'CLASS' && !classId) return setError('Choose the class this announcement is for.');
    setBusy(true); setError(null);
    try {
      const saved = await saveAnnouncement(existing?.id ?? null, { title: title.trim(), audience, class_id: audience === 'CLASS' ? classId : null, body: body.trim() });
      if (publish) await publishAnnouncement(saved.id);
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Unable to save this announcement. Please try again.');
    } finally { setBusy(false); }
  };

  const isDraftOrNew = !existing || existing.status === 'DRAFT';
  return (
    <Modal open={editor !== null} onClose={onClose} title={existing ? 'Edit Announcement' : 'Create Announcement'}
      footer={<>
        <Button onClick={onClose} disabled={busy}>Cancel</Button>
        <Button onClick={() => save(false)} disabled={busy}>{isDraftOrNew ? 'Save as Draft' : 'Save Changes'}</Button>
        {isDraftOrNew && <Button variant="primary" onClick={() => save(true)} disabled={busy}>{busy ? 'Saving…' : 'Publish Now'}</Button>}
      </>}>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <Input label="Title" required maxLength={150} placeholder="e.g. Mid-Term Examination Schedule" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Audience" options={audienceOptions} value={audience} onChange={(e) => setAudience(e.target.value as AnnouncementAudience)} />
          {audience === 'CLASS' && <Select label="Class" options={[{ value: '', label: 'Select a class' }, ...classes.map((c) => ({ value: c.id, label: c.name }))]} value={classId} onChange={(e) => setClassId(e.target.value)} />}
        </div>
        <div>
          <label htmlFor="announcement-body" className="mb-1 block text-xs font-semibold text-charcoal-lighter">Message</label>
          <textarea id="announcement-body" required rows={8} maxLength={5000} placeholder="Write the announcement…" value={body} onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-lg border border-warm-200 bg-white p-3 text-sm placeholder:text-charcoal-muted focus:outline-2 focus:outline-teal" />
        </div>
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      </form>
    </Modal>
  );
}
