import type { ReactNode } from 'react';

interface PageContainerProps { title: string; description?: string; eyebrow?: ReactNode; actions?: ReactNode; children?: ReactNode; }

export function PageContainer({ title, description, eyebrow, actions, children }: PageContainerProps) {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          {eyebrow && <div className="mb-1 flex items-center gap-1 text-[11px] font-bold tracking-wider text-charcoal-muted uppercase">{eyebrow}</div>}
          <h1 className="text-[28px] leading-9 font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-charcoal-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
