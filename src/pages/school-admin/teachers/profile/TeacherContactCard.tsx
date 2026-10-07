import { Card } from '../../../../components/ui/Card';
import { CardTitle } from '../../../../components/ui/DetailField';
import { Icon } from '../../../../components/ui/Icon';
import type { TeacherDetail } from '../../../../types/teacher';

export function TeacherContactCard({ teacher: t }: { teacher: TeacherDetail }) {
  const row = 'flex items-start gap-3 rounded-lg p-2 hover:bg-warm-100';
  const label = 'text-[11px] font-bold tracking-wider text-charcoal-muted uppercase';
  return (
    <Card className="space-y-2">
      <CardTitle icon="contact_phone">Contact</CardTitle>
      <div className={row}><Icon name="call" size={20} className="mt-0.5 text-charcoal-muted" />
        <div className="flex flex-col gap-0.5"><span className={label}>Mobile Phone</span><a href={`tel:${t.phone.replace(/\s/g, '')}`} className="text-sm font-medium text-teal hover:underline">{t.phone}</a></div></div>
      <div className={row}><Icon name="mail" size={20} className="mt-0.5 text-charcoal-muted" />
        <div className="flex flex-col gap-0.5"><span className={label}>Email</span><a href={`mailto:${t.email}`} className="text-sm font-medium text-teal hover:underline">{t.email}</a></div></div>
    </Card>
  );
}
