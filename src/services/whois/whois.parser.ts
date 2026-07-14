/**
 * Raw RDAP response shape (subset) returned by rdap.org. Only this file
 * should know these field names — vCard arrays, entity roles, etc.
 */
interface RdapEntity {
  roles?: string[];
  handle?: string;
  publicIds?: { type?: string; identifier?: string }[];
  vcardArray?: [string, RdapVCardField[]];
}

type RdapVCardField = [string, Record<string, unknown>, string, ...unknown[]];

interface RdapEvent {
  eventAction: string;
  eventDate: string;
}

interface RdapNameserver {
  ldhName: string;
}

interface RdapResponse {
  ldhName?: string;
  handle?: string;
  status?: string[];
  events?: RdapEvent[];
  nameservers?: RdapNameserver[];
  entities?: RdapEntity[];
}

/**
 * The normalized WHOIS result shape consumed by the WHOIS Lookup page.
 * `parsed` uses human-readable display labels as keys (preserved from
 * the original implementation so the UI layer requires no changes),
 * and `raw` is a plain-text rendering of the same data for the "Raw
 * View" toggle and copy-to-clipboard.
 */
export interface WHOISResult {
  raw: string;
  parsed: Record<string, string>;
}

function findVCardValue(vcard: RdapVCardField[] | undefined, field: string): string | undefined {
  const entry = vcard?.find(v => v[0] === field);
  // vCard entries are [field, params, type, value, ...]
  return entry?.[3] as string | undefined;
}

function findVCardCountry(vcard: RdapVCardField[] | undefined): string | undefined {
  const entry = vcard?.find(v => v[0] === 'adr');
  // Address vCard value is an array; country is typically index 6.
  const value = entry?.[3] as unknown;
  if (Array.isArray(value)) return value[6] as string | undefined;
  return undefined;
}

/**
 * Converts a raw RDAP response into the application's normalized WHOIS
 * model. If the RDAP provider or field structure changes, only this
 * function needs to change — the page only ever reads display labels
 * like `parsed['Domain Name']`.
 */
export function parseWHOISResponse(raw: RdapResponse, fallbackDomain: string): WHOISResult {
  const parsed: Record<string, string> = {};

  parsed['Domain Name'] = raw.ldhName || fallbackDomain.toUpperCase();
  parsed['Registry Domain ID'] = raw.handle || 'N/A';
  parsed['Status'] = (raw.status || []).join(', ') || 'N/A';

  for (const event of raw.events ?? []) {
    if (event.eventAction === 'registration') parsed['Created Date'] = event.eventDate;
    if (event.eventAction === 'expiration') parsed['Expiry Date'] = event.eventDate;
    if (event.eventAction === 'last changed') parsed['Updated Date'] = event.eventDate;
  }

  if (raw.nameservers?.length) {
    parsed['Name Servers'] = raw.nameservers.map(ns => ns.ldhName).join(', ');
  }

  for (const entity of raw.entities ?? []) {
    const vcard = entity.vcardArray?.[1];

    if (entity.roles?.includes('registrar')) {
      parsed['Registrar'] = findVCardValue(vcard, 'fn') || entity.handle || 'N/A';
      const ianaId = entity.publicIds?.[0]?.identifier;
      if (ianaId) parsed['Registrar IANA ID'] = ianaId;
    }

    if (entity.roles?.includes('registrant')) {
      const org = findVCardValue(vcard, 'org');
      const country = findVCardCountry(vcard);
      if (org) parsed['Registrant Organization'] = org;
      if (country) parsed['Registrant Country'] = country;
    }
  }

  const rawText = Object.entries(parsed)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  return { raw: rawText, parsed };
}

export type { RdapResponse };
