import { useLocation } from 'react-router-dom';
import { useSeo } from '../components/seo/useSeo';
import { lookupPageMeta } from '../lib/page-meta';

/**
 * @deprecated Use <Seo>. Kept so pages I have not seen still prerender correct head tags.
 * Static routes pick up their title/description from src/lib/page-meta.ts.
 */
export function usePageMeta({ title, description }: { title: string; description?: string }) {
  const { pathname } = useLocation();
  const o = lookupPageMeta(pathname);
  useSeo({
    title: o?.title ?? title,
    description: o?.description ?? description ?? '',
    path: pathname,
    noindex: o?.noindex,
  });
}