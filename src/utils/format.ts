export const percent = (part: number, total: number) => (total === 0 ? 0 : Math.round((part / total) * 1000) / 10);

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(iso).toLocaleDateString('en-GB', opts);

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();

export function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  if (minutes < 1440) return rtf.format(-Math.round(minutes / 60), 'hour');
  return rtf.format(-Math.round(minutes / 1440), 'day');
}

export function ageFrom(iso: string): number {
  const dob = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  if (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate())) age -= 1;
  return age;
}

// Local calendar date as YYYY-MM-DD
export const todayIso = () => new Date().toLocaleDateString('en-CA');

export function shiftDate(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-CA');
}

// "07:38" -> "07:38 AM"
export function formatClock(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

export const formatTimeOfDay = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export const formatDateTime = (iso: string) => `${formatDate(iso, { day: 'numeric', month: 'short' })}, ${formatTimeOfDay(iso)}`;

// "Today" / "Tomorrow" / "in 3 days" / "2 days ago", by calendar day
export function relativeDay(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
}

export const formatBytes = (n: number) => (n >= 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
