import type { ComponentType } from 'react';

export interface Author {
  name: string;
  url?: string;
}

export interface ToolContent {
  toolId: string;
  /** Optional shorter title (without " | NET Asia"). Defaults to the page title. */
  metaTitle?: string;
  /** 140 to 160 characters, unique per page. */
  metaDescription: string;
  /** Existing short sections, moved over unchanged. Replace with the structured fields as you write. */
  sections?: { heading: string; content: string }[];
  intro: string[];
  whatItShows: { field: string; meaning: string; example: string }[];
  howToUse: string[];
  useCases: { title: string; scenario: string; whatToLookFor: string }[];
  sampleOutput: { input: string; rows: { field: string; value: string }[]; interpretation: string } | null;
  troubleshooting: { symptom: string; cause: string; fix: string }[];
  bestPractices: string[];
  glossary: { term: string; definition: string }[];
  limitations: string[];
  dataSources: { name: string; url: string; note: string }[];
  /** Target 8 to 10 items once the long content is written. */
  faqs: { q: string; a: string }[];
  relatedGuides: string[];
  relatedTools: string[];
  /** ISO date (YYYY-MM-DD). Update it only when you actually re-review the text. */
  lastReviewed: string;
  author: Author;
}

export interface GuideMeta {
  title: string;
  description: string;
  slug: string;
  category: string;
  datePublished: string;
  dateModified: string;
  author: Author;
  readingMinutes: number;
  relatedTools: string[];
  relatedGuides: string[];
  /** Drafts are not listed, prerendered, or routed. */
  draft?: boolean;
}

export interface GuideModule {
  meta: GuideMeta;
  default: ComponentType;
}