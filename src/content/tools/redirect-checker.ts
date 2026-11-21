import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "redirect-checker",
  metaDescription:
    "Trace every redirect hop for a URL, including HTTP to HTTPS upgrades and www redirects, and see the final destination. Free, no signup required.",
  sections: [
  { heading: "What this tool does", content: "The URL Redirect Checker traces every redirect in a URL's chain, displaying the HTTP status code, status text, and destination URL at each step. It shows the total redirect count, total elapsed time, the final destination URL, and flags HTTP-to-HTTPS upgrades." },
  { heading: "How it works", content: "Requests are sent through a CORS proxy using HEAD method with manual redirect handling. Each redirect response is captured individually, allowing the full chain to be displayed step by step rather than just returning the final destination." },
  { heading: "When to use it", content: "Use the Redirect Checker to diagnose redirect loops, confirm that HTTP-to-HTTPS upgrades are in place, verify www-to-non-www or non-www-to-www redirects, debug affiliate or tracking links, confirm canonical URL behaviour, and check that old URLs redirect correctly after a site migration." },
  { heading: "HTTP status codes in redirects", content: "301 (Moved Permanently) and 308 (Permanent Redirect) tell search engines to transfer link equity to the destination. 302 (Found) and 307 (Temporary Redirect) do not transfer link equity and are used for short-term redirects. Using 301 incorrectly where a temporary redirect is intended can cause SEO issues." },
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
  { q: "What is a redirect loop?", a: "A redirect loop occurs when URL A redirects to URL B and URL B redirects back to URL A (or through a chain that eventually returns to A). Browsers detect this and show an error after a set number of hops. The tool will show the chain until it reaches the maximum hop limit." },
  { q: "Why is an HTTP-to-HTTPS upgrade important?", a: "Serving pages over HTTP sends data in plain text, making it vulnerable to interception. An HTTP-to-HTTPS redirect ensures all traffic is encrypted. Combined with the HSTS header (visible in the HTTP Headers Checker), this protects users even if they type the http:// version of your URL." },
  { q: "What is the maximum number of redirects traced?", a: "The tool follows up to 10 redirect hops. This covers the vast majority of legitimate redirect chains. Chains longer than 10 hops typically indicate a misconfiguration." },
  { q: "Why might results differ from my browser?", a: "Browsers may cache redirects, send cookies that affect redirect behaviour, or follow different redirect rules for non-GET requests. This tool sends a clean HEAD request with no cookies or session data, which shows the default redirect behaviour of the server." },
],
  relatedGuides: [],
  relatedTools: ["http-headers","website-tech","ssl-checker"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
