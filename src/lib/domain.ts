import { ApiError } from './errors';

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9_-]{1,63}\.)+[a-z0-9-]{2,63}$/;

/** Accepts "example.com", "https://Example.com/path", or an IDN; returns a lowercase ASCII hostname. */
export function cleanDomain(input: string): string {
  let d = input
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
    .replace(/[/?#].*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.$/, '');
  try {
    d = new URL(`http://${d}`).hostname; // converts IDN to punycode
  } catch {
    d = '';
  }
  if (!d || !DOMAIN_RE.test(d)) {
    throw new ApiError('invalid-input', 'Enter a valid domain name, for example example.com.');
  }
  return d;
}