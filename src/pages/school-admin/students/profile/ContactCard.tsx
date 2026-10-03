import { Card } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/ui/Icon';
import type { StudentDetail } from '../../../../types/student';
import { CardTitle, Field } from './StudentInformationCard';

export function ContactCard({ student: s }: { student: StudentDetail }) {
  const g = s.guardian;
  return (
    <Card className="space-y-4">
      <CardTitle icon="contact_phone">Contact Information</CardTitle>
      <div className="rounded-lg bg-warm-100 p-4">
        <span className="mb-2 block text-xs font-semibold">Student Direct Contacts</span>
        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
          <span className="flex items-center gap-2"><Icon name="call" size={18} className="text-charcoal-muted" />{s.student_contact.phone}</span>
          <span className="flex items-center gap-2 truncate"><Icon name="mail" size={18} className="text-charcoal-muted" /><span className="truncate">{s.student_contact.email}</span></span>
        </div>
      </div>
      <div className="space-y-2 rounded-lg bg-warm-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">Primary Guardian</span>
          <span className="rounded bg-warm-200 px-2 py-0.5 text-[11px] font-medium text-charcoal-lighter">{g.relationship}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
          <Field label="Guardian Name">{g.name}</Field>
          <Field label="Contact Telephone">{g.phone}</Field>
          <Field label="Email Address" className="sm:col-span-2">{g.email}</Field>
          <Field label="Residential Address" className="sm:col-span-2">{g.address}</Field>
        </div>
      </div>
    </Card>
  );
}
