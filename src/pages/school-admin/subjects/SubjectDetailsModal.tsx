import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Field } from '../../../components/ui/DetailField';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LevelBadge } from '../../../components/ui/LevelBadge';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Modal } from '../../../components/ui/Modal';
import { CATEGORY_LABEL } from '../../../constants/subject';
import { useAsync } from '../../../hooks/useAsync';
import { getSubject } from '../../../services/subjectService';

export function SubjectDetailsModal({ subjectId, onClose }: { subjectId: string | null; onClose: () => void }) {
  const { data, error, loading, reload } = useAsync(useCallback(() => (subjectId ? getSubject(subjectId) : Promise.resolve(null)), [subjectId]));
  const s = data && !error && data.id === subjectId ? data : null;
  return (
    <Modal open={!!subjectId} onClose={onClose} title={s ? s.name : 'Subject Details'} footer={<Button onClick={onClose}>Close</Button>}>
      {loading && !s && <LoadingState label="Loading subject…" />}
      {error && <ErrorState title="Unable to load this subject" message={`${error.message} Please try again.`} onRetry={reload} />}
      {s && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {s.description && <Field label="Description" className="sm:col-span-2">{s.description}</Field>}
          <Field label="Code"><b>{s.code}</b></Field>
          <Field label="School Level"><LevelBadge level={s.level} /></Field>
          <Field label="Category">{CATEGORY_LABEL[s.category]}</Field>
          <Field label="Status"><Badge dot tone={s.status === 'ACTIVE' ? 'teal' : 'neutral'}>{s.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge></Field>
          <Field label="Classes" className="sm:col-span-2">{s.classes.length ? s.classes.map((c) => c.name).join(', ') : 'Not allocated to any class'}</Field>
          <Field label="Assigned Teachers" className="sm:col-span-2">
            {s.teachers.length ? (
              <span className="flex flex-wrap gap-x-3 gap-y-1">{s.teachers.map((t) => <Link key={t.id} to={`/app/teachers/${t.id}`} className="font-medium text-teal hover:underline">{t.full_name}</Link>)}</span>
            ) : 'No teachers assigned'}
          </Field>
        </div>
      )}
    </Modal>
  );
}
