interface AvatarProps { name: string; src?: string | null; size?: number; shape?: 'circle' | 'rounded'; className?: string; }

export function Avatar({ name, src, size = 32, shape = 'circle', className = '' }: AvatarProps) {
  const initials = name.replace(/^(Mr|Mrs|Ms|Miss|Dr|Prof)\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const round = shape === 'circle' ? 'rounded-full' : 'rounded-xl';
  return src ? (
    <img src={src} alt={name} style={{ width: size, height: size }} className={`shrink-0 object-cover ${round} ${className}`} />
  ) : (
    <span style={{ width: size, height: size, fontSize: size * 0.36 }} aria-label={name}
      className={`inline-flex shrink-0 items-center justify-center bg-teal-pale font-bold text-teal-dark ${round} ${className}`}>
      {initials}
    </span>
  );
}
