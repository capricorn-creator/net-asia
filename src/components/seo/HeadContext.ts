import { createContext } from 'react';
import type { SeoData } from '../../lib/seo';

/** Only provided during the build-time server render. */
export interface HeadCollector {
  data: SeoData | null;
  forceNoIndex?: boolean;
}

export const HeadContext = createContext<HeadCollector | null>(null);