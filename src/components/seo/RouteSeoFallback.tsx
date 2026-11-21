import { useLocation } from 'react-router-dom';
import { useSeo } from './useSeo';
import { lookupPageMeta } from '../../lib/page-meta';

/** Gives static routes (home, about, legal…) correct meta even if the page never calls <Seo>. */
export default function RouteSeoFallback() {
  const { pathname } = useLocation();
  const m = lookupPageMeta(pathname);
  useSeo(m ? { title: m.title, description: m.description, path: pathname, noindex: m.noindex } : null);
  return null;
}