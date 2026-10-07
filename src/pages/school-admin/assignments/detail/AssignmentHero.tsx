import { useState } from 'react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/ui/Icon';
import { Modal } from '../../../../components/ui/Modal';
import { ApiError } from '../../../../services/apiClient';
import { closeAssignment, publishAssignment } from '../../../../services/assignmentService';
import type { AssignmentDetail } from '../../../../types/assignment';
import { AssignmentStatusBadge, CategoryBadge } from '../AssignmentBadges';

export function AssignmentHero({ a, onChanged }: { a: AssignmentDetail; onChanged: () => void }) {
  const [confirmClose, setConfirmClose] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setError(null);
    try { await fn(); setConfirmClose(false); onChanged(); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  };

  return (
    <Card className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <AssignmentStatusBadge status={a.status} />
          <Badge tone="teal">{a.subject.name} ({a.subject.code})</Badge>
          <Badge>{a.class.name}</Badge>
          <CategoryBadge category={a.category} />
        </div>
        <h1 className="text-[28px] leading-9 font-bold tracking-tight">{a.title}</h1>
        <p className="text-xs text-charcoal-muted">
          Assigned to <b className="font-medium text-charcoal">{a.class.name}</b>
          {a.teacher && <> • Teacher: <b className="font-medium text-charcoal">{a.teacher.full_name}</b> ({a.teacher.employee_number})</>}
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 xl:items-end">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="surface"><Icon name="file_download" size={18} className="text-charcoal-muted" />Export Report</Button>
          {a.status === 'PUBLISHED' && <Button variant="surface" onClick={() => setConfirmClose(true)}><Icon name="lock_clock" size={18} className="text-charcoal-muted" />Close Submissions</Button>}
          {a.status === 'DRAFT' && <Button variant="primary" disabled={busy} onClick={() => run(() => publishAssignment(a.id))}><Icon name="publish" size={18} />{busy ? 'Publishing…' : 'Publish'}</Button>}
          <Button variant="surface"><Icon name="edit_note" size={18} className="text-charcoal-muted" />Edit Assignment</Button>
        </div>
        {error && !confirmClose && <p role="alert" className="text-xs text-danger">{error}</p>}
      </div>
      <Modal open={confirmClose} onClose={() => setConfirmClose(false)} title="Close submissions?"
        footer={<><Button onClick={() => setConfirmClose(false)} disabled={busy}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => run(() => closeAssignment(a.id))}>{busy ? 'Closing…' : 'Close Submissions'}</Button></>}>
        <p className="text-sm text-charcoal-lighter">Learners will no longer be able to submit work for “{a.title}”. Marking can continue.</p>
        {error && <p role="alert" className="mt-3 text-xs text-danger">{error}</p>}
      </Modal>
    </Card>
  );
}
