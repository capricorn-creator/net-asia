import type { GuideMeta, GuideModule } from '../types';

// Every ./<slug>.tsx file is a guide. Files starting with "_" (like _template.tsx) are ignored.
const modules = import.meta.glob<GuideModule>(['./*.tsx', '!./_*.tsx'], { eager: true });
const all = Object.values(modules).filter(m => m.meta && !m.meta.draft);

export const GUIDES: GuideMeta[] = all
  .map(m => m.meta)
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished));

export function getGuide(slug: string) {
  const m = all.find(x => x.meta.slug === slug);
  return m ? { meta: m.meta, Body: m.default } : undefined;
}

export const getGuideMeta = (slug: string) => GUIDES.find(g => g.slug === slug);

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');