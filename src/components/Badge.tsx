import type { ReactNode } from 'react';

const TONES = {
  neutral: 'bg-navy-50 text-navy-700 ring-navy-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  gold: 'bg-gold-500/15 text-navy-800 ring-gold-500/40',
  // Solid fill for use on the navy hero, where the tinted variant has no contrast.
  goldOnDark: 'bg-gold-500 text-navy-900 ring-gold-400',
  onDark: 'bg-white/15 text-white ring-white/30',
  warning: 'bg-orange-50 text-orange-800 ring-orange-200',
  danger: 'bg-red-50 text-red-800 ring-red-200',
} as const;

export default function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
