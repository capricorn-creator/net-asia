import type { DetectedTech, TechCategory, TechDetectionResult } from '../../types';

// ── Wappalyzer-style raw shapes (from api.wappalyzer.com) ────────────────────

interface WappalyzerTech {
  name: string;
  slug?: string;
  confidence?: number;
  version?: string | null;
  categories?: { id: number; slug?: string; name: string }[];
  website?: string;
  icon?: string;
}

interface WappalyzerResponse {
  urls?: Record<string, { status: number }>;
  technologies?: WappalyzerTech[];
}

// ── Category mapping ─────────────────────────────────────────────────────────

const WAPPALYZER_CATEGORY_MAP: Record<string, TechCategory> = {
  'cms': 'cms',
  'ecommerce': 'ecommerce',
  'js-frameworks': 'js-framework',
  'web-frameworks': 'framework',
  'javascript-frameworks': 'js-framework',
  'ui-frameworks': 'ui-library',
  'analytics': 'analytics',
  'tag-managers': 'analytics',
  'cdn': 'cdn',
  'web-servers': 'server',
  'web-server': 'server',
  'hosting-panels': 'hosting',
  'programming-languages': 'language',
  'security': 'security',
  'databases': 'database',
};

function mapCategory(rawCategory?: string): TechCategory {
  if (!rawCategory) return 'other';
  const key = rawCategory.toLowerCase().replace(/ /g, '-');
  return WAPPALYZER_CATEGORY_MAP[key] || 'other';
}

// ── Public parser ─────────────────────────────────────────────────────────────

export function parseTechResponse(
  raw: WappalyzerResponse,
  url: string,
  responseTime: number
): TechDetectionResult {
  const technologies: DetectedTech[] = (raw.technologies || []).map(t => ({
    name: t.name,
    category: mapCategory(t.categories?.[0]?.slug || t.categories?.[0]?.name),
    confidence: t.confidence ?? 100,
    version: t.version || undefined,
    website: t.website,
  }));

  // Sort by confidence desc, then name asc
  technologies.sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));

  const summary = technologies.reduce((acc, tech) => {
    acc[tech.category] = (acc[tech.category] || 0) + 1;
    return acc;
  }, {} as Record<TechCategory, number>);

  return { url, technologies, summary, responseTime };
}

export type { WappalyzerResponse };
