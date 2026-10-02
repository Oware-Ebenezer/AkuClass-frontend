import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`} {...rest} />;
}
