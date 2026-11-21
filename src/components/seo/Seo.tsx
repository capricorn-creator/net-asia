import { useLocation } from 'react-router-dom';
import { useSeo } from './useSeo';
import type { SeoData } from '../../lib/seo';

type Props = Omit<SeoData, 'path'> & { path?: string };

export default function Seo({ path, ...rest }: Props) {
  const { pathname } = useLocation();
  useSeo({ ...rest, path: path ?? pathname });
  return null;
}