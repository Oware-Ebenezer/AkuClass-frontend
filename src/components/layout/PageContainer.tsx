import type { ReactNode } from 'react';

interface PageContainerProps { title: string; description?: string; actions?: ReactNode; children?: ReactNode; }

export const PageContainer = ({ title, description, actions, children }: PageContainerProps) => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-[28px] leading-9 font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-charcoal-muted">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 self-start md:self-auto">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
