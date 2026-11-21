import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "website-tech",
  metaDescription:
    "Detect the CMS, frameworks, analytics, CDN, and server software a website uses, based on its HTML and response headers. Free, no signup required.",
  sections: [
  { heading: 'What this tool does', content: 'The Website Tech Detector identifies the technologies powering any website — including CMS platforms, JavaScript frameworks, UI libraries, analytics providers, CDN services, web servers, programming languages, and e-commerce systems. Results are grouped by category with confidence scores.' },
  { heading: 'How it works', content: 'Detection data is retrieved from the Wappalyzer public lookup API, which fingerprints websites using HTTP headers, HTML patterns, script names, cookie signatures, and other publicly visible signals. The API has catalogued thousands of technologies across hundreds of categories.' },
  { heading: 'When to use it', content: 'Use this tool during competitor analysis, technical due diligence, security assessments, or when evaluating whether a site uses specific technology before building an integration. It is also useful for sales prospecting and market research in the technology sector.' },
  { heading: 'Limitations', content: 'Technology detection relies on publicly visible signals. Sites that obfuscate their stack, use custom builds without identifiable fingerprints, or serve different content to crawlers may return incomplete results. Server-side technologies without client-visible indicators cannot be detected.' },
],
  intro: [],
  whatItShows: [],
  howToUse: [],
  useCases: [],
  sampleOutput: null,
  troubleshooting: [],
  bestPractices: [],
  glossary: [],
  limitations: [],
  dataSources: [],
  faqs: [
  { q: 'Why is confidence less than 100%?', a: 'Confidence reflects how many fingerprinting signals matched for a given technology. A score below 100% means some — but not all — expected signals were found. A framework might be detected from a script filename alone, which gives moderate confidence rather than certainty.' },
  { q: 'Can I detect technologies on password-protected sites?', a: 'No. The tool can only analyse publicly accessible pages. Login walls, paywalls, and access-controlled content will not yield technology results since the API cannot access protected content.' },
  { q: 'Why might results differ from what I know a site uses?', a: 'Some technologies are intentionally hidden. Others may not be detected if confidence is very low. Sites also change their stack over time, and detection databases may not reflect the most recent changes immediately.' },
  { q: 'Is this tool useful for security auditing?', a: 'Yes. Knowing which framework, server version, or plugin is in use can help identify whether known vulnerabilities apply. Combine tech detection with your SSL and HTTP Headers results for a more complete security picture.' },
],
  relatedGuides: [],
  relatedTools: ["http-headers","ssl-checker","redirect-checker"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
