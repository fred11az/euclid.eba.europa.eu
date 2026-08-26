'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ShareButtons({ title }: { title: string }) {
  const t = useTranslations('detail');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      /* user dismissed the share sheet, or the clipboard is unavailable */
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-navy-200 px-4 text-sm font-semibold text-navy-800 hover:bg-navy-50"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="currentColor" d="M18 16.1a3 3 0 0 0-2 .8l-7.1-4.2q.1-.4 0-1.4L16 7.1a3 3 0 1 0-1-2.1q0 .4.1.7L8 9.9a3 3 0 1 0 0 4.2l7.1 4.2q-.1.3-.1.6a3 3 0 1 0 3-3z" />
      </svg>
      <span aria-live="polite">{copied ? t('copied') : t('share')}</span>
    </button>
  );
}
