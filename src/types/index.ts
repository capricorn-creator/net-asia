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
