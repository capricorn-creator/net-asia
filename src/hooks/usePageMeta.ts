import { useEffect } from 'react';

interface Meta {
  title: string;
  description?: string;
}

const SITE = 'NetAsia';

export function usePageMeta({ title, description }: Meta) {
  useEffect(() => {
    const prev = document.title;
    document.title = title === SITE ? SITE : `${title} — ${SITE}`;

    let descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.name = 'description';
      document.head.appendChild(descEl);
    }
    const prevDesc = descEl.content;
    if (description) descEl.content = description;

    return () => {
      document.title = prev;
      if (description && descEl) descEl.content = prevDesc;
    };
  }, [title, description]);
}
