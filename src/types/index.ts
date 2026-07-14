export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  path: string;
  isNew?: boolean;
  isPopular?: boolean;
  comingSoon?: boolean;
  color: 'blue' | 'cyan' | 'purple' | 'green' | 'orange' | 'pink';
}

export type ToolCategory =
  | 'network'
  | 'security'
  | 'website'
  | 'developer'
  | 'dns'
  | 'domain'
  | 'ssl'
  | 'utilities'
  | 'encoding';

export interface Category {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
  priority?: number;
}

export interface IPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  org?: string;
  isp?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  asn?: string;
  hostname?: string;
}

export interface WHOISData {
  domain: string;
  registrar?: string;
  createdDate?: string;
  updatedDate?: string;
  expiryDate?: string;
  nameservers?: string[];
  status?: string[];
  registrantOrg?: string;
  registrantCountry?: string;
  raw?: string;
}

export interface SSLCertificate {
  subject?: string;
  issuer?: string;
  validFrom?: string;
  validTo?: string;
  daysRemaining?: number;
  isValid?: boolean;
  protocol?: string;
  cipher?: string;
  subjectAltNames?: string[];
  serialNumber?: string;
  fingerprint?: string;
}

export interface HTTPHeader {
  name: string;
  value: string;
}

export interface HTTPResponse {
  url: string;
  status: number;
  statusText: string;
  headers: HTTPHeader[];
  redirects?: string[];
  responseTime?: number;
  serverInfo?: string;
}

export type Theme = 'dark' | 'light';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// ── Phase 2B Types ──────────────────────────────────────────────

/** Technology category used by Website Tech Detector */
export type TechCategory =
  | 'framework'
  | 'cms'
  | 'js-framework'
  | 'ui-library'
  | 'analytics'
  | 'cdn'
  | 'hosting'
  | 'server'
  | 'language'
  | 'security'
  | 'ecommerce'
  | 'database'
  | 'other';

export interface DetectedTech {
  name: string;
  category: TechCategory;
  /** Confidence 0–100 */
  confidence: number;
  version?: string;
  website?: string;
  icon?: string;
}

export interface TechDetectionResult {
  url: string;
  technologies: DetectedTech[];
  /** Total count by category */
  summary: Record<TechCategory, number>;
  responseTime: number;
}

/** Enhanced geolocation result (superset of IPInfo) */
export interface GeoIPResult {
  ip: string;
  type: 'IPv4' | 'IPv6';
  continent?: string;
  country?: string;
  country_name?: string;
  country_code?: string;
  /** Two-letter emoji flag derived from country_code */
  flag?: string;
  region?: string;
  city?: string;
  zip?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  asn?: string;
  org?: string;
  isp?: string;
  is_mobile?: boolean;
  is_proxy?: boolean;
}

/** Single PTR record result for Reverse DNS */
export interface ReverseDNSResult {
  ip: string;
  hostname: string | null;
  status: 'resolved' | 'no-ptr' | 'error';
  ttl?: number;
  responseTime: number;
}

/** One resolver result row for DNS Propagation Checker */
export interface PropagationResult {
  resolver: string;
  resolverName: string;
  location: string;
  values: string[];
  status: 'success' | 'nxdomain' | 'timeout' | 'error';
  responseTime: number;
}

export interface DNSPropagationResult {
  domain: string;
  recordType: string;
  results: PropagationResult[];
  checkedAt: string;
}

/** One step in a redirect chain */
export interface RedirectStep {
  url: string;
  status: number;
  statusText: string;
}

export interface RedirectResult {
  originalUrl: string;
  finalUrl: string;
  steps: RedirectStep[];
  redirectCount: number;
  totalResponseTime: number;
  isHttpsUpgrade: boolean;
}
