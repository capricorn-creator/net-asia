import { httpClient } from '../http/client';
import { AppError } from '../http/errors';
import type { TechDetectionResult } from '../../types';
import { parseTechResponse, type WappalyzerResponse } from './tech.parser';

// Wappalyzer offers a free no-auth CDN-based lookup via their public API.
// The endpoint returns technology fingerprints without requiring authentication.
const WAPPALYZER_URL = 'https://api.wappalyzer.com/lookup/v2/?urls=';

function normalizeUrl(input: string): string {
  const trimmed = input.trim().replace(/\/$/, '');
  if (!trimmed.startsWith('http')) return `https://${trimmed}`;
  return trimmed;
}

/**
 * Detects technologies used on a website using the Wappalyzer public lookup API.
 * Returns a normalized TechDetectionResult with categorized technologies,
 * confidence scores, and a per-category summary.
 */
export async function detectTechnologies(url: string): Promise<TechDetectionResult> {
  const targetUrl = normalizeUrl(url);
  if (!targetUrl || targetUrl === 'https://') {
    throw new AppError('Please enter a valid URL or domain.', 'INVALID_INPUT');
  }

  const start = Date.now();
  const apiUrl = `${WAPPALYZER_URL}${encodeURIComponent(targetUrl)}`;

  // Wappalyzer returns an array of results, one per URL submitted
  const results = await httpClient.get<WappalyzerResponse[]>(apiUrl, {
    timeoutMs: 20_000, // tech detection can be slow
  });

  const responseTime = Date.now() - start;

  if (!Array.isArray(results) || results.length === 0) {
    throw new AppError('No technology data found for this URL.', 'NOT_FOUND');
  }

  const data = results[0];

  if (!data.technologies?.length) {
    throw new AppError(
      'No technologies were detected for this URL. The site may be behind a firewall or require JavaScript to load.',
      'NOT_FOUND'
    );
  }

  return parseTechResponse(data, targetUrl, responseTime);
}
