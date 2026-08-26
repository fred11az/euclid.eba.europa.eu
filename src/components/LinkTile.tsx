import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

export default function LinkTile({
  href,
  title,
  meta,
  icon,
}: {
  href: string;
  title: string;
  meta?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-16 items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 shadow-sm transition hover:border-navy-300 hover:shadow-md"
    >
      {icon && <span aria-hidden="true" className="text-2xl leading-none">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-navy-900">{title}</span>
        {meta && <span className="block truncate text-xs text-navy-500">{meta}</span>}
      </span>
      <span aria-hidden="true" className="flip-x text-navy-300">›</span>
    </Link>
  );
}
