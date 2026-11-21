import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "http-headers",
  metaDescription:
    "Inspect the HTTP status code and response headers for any URL, and see which common security headers are present or missing. Free, no signup required.",
  sections: [
  { heading: "What this tool does", content: "The HTTP Headers Checker fetches the response headers from any URL and displays them alongside a security header coverage score. It highlights which critical security headers are present and flags any that are missing." },
  { heading: "How it works", content: "Requests are routed through a CORS proxy (corsproxy.io) since browsers block reading cross-origin response headers directly. The proxy forwards the HEAD request and returns the response headers, which are then analysed against a list of recommended security headers." },
  { heading: "Security headers explained", content: "The tool checks for seven key headers: Strict-Transport-Security (HSTS) enforces HTTPS; Content-Security-Policy (CSP) restricts resource loading; X-Frame-Options prevents clickjacking; X-Content-Type-Options stops MIME sniffing; Referrer-Policy controls referrer data; Permissions-Policy limits browser feature access; and X-XSS-Protection is a legacy XSS filter." },
  { heading: "Limitations", content: "Results depend on the availability of the CORS proxy. Some servers block HEAD requests and require a GET fallback, which may return an opaque response with limited header visibility. Rate-limited or authentication-protected endpoints may not return complete header sets." },
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
  { q: "What is an \"opaque response\"?", a: "When a CORS proxy is unavailable and a direct no-cors fetch is used as a fallback, the browser returns an opaque response \u2014 one where headers and body are hidden due to cross-origin restrictions. The server has responded, but the content cannot be read." },
  { q: "What is HSTS?", a: "HTTP Strict Transport Security instructs browsers to always use HTTPS for the domain, even if the user types http://. It prevents protocol downgrade attacks. The max-age directive determines how long browsers remember this instruction." },
  { q: "Why is Content-Security-Policy important?", a: "CSP prevents cross-site scripting (XSS) attacks by specifying exactly which sources of scripts, styles, images, and other resources the browser is allowed to load. A correctly configured CSP is one of the most effective defences against injection attacks." },
  { q: "How is the security score calculated?", a: "The score is the percentage of the seven checked security headers that are present in the response. A score of 100% means all seven headers were returned. Missing headers are listed individually so you can address them." },
],
  relatedGuides: [],
  relatedTools: ["ssl-checker","website-tech","redirect-checker"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
