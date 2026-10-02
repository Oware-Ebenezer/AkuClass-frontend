interface IconProps { name: string; size?: number; className?: string; }

export const Icon = ({ name, size = 20, className = '' }: IconProps) => {
  return <span aria-hidden className={`material-symbols-outlined leading-none ${className}`} style={{ fontSize: size }}>{name}</span>;
}
