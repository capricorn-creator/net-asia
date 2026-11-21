import type { ToolContent } from '../types';

const modules = import.meta.glob<{ content: ToolContent }>(['./*.ts', '!./index.ts'], { eager: true });

export const TOOL_CONTENT: Record<string, ToolContent> = Object.fromEntries(
  Object.values(modules).map(m => [m.content.toolId, m.content])
);

export interface GlossaryEntry {
  term: string;
  definition: string;
  toolIds: string[];
}

/** One entry per term (case-insensitive). The first definition wins. */
export function getGlossary(): GlossaryEntry[] {
  const map = new Map<string, GlossaryEntry>();
  for (const c of Object.values(TOOL_CONTENT)) {
    for (const g of c.glossary) {
      const key = g.term.toLowerCase();
      const hit = map.get(key);
      if (hit) {
        if (!hit.toolIds.includes(c.toolId)) hit.toolIds.push(c.toolId);
      } else {
        map.set(key, { term: g.term, definition: g.definition, toolIds: [c.toolId] });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.term.localeCompare(b.term, 'en'));
}