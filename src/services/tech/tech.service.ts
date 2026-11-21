import { ApiError } from '../../lib/errors';
import { fetchTech } from '../../lib/api';
import { attachSource } from '../../lib/source-store';
import type { TechDetectionResult } from '../../types';

/**
 * Detects technologies from a live request's response headers and HTML,
 * using fingerprint rules we maintain ourselves (functions/_lib/fingerprints.ts).
 */
export async function detectTechnologies(url: string): Promise<TechDetectionResult> {
  const target = url.trim();
  if (!target) throw new ApiError('invalid-input', 'Please enter a valid URL or domain.');

  const { source, ...data } = await fetchTech(target);
  if (!data.technologies.length) {
    throw new ApiError(
      'not-found',
      'No technologies matched our fingerprint rules. The site may render everything with JavaScript, or may use tools we do not have rules for yet.'
    );
  }
  return attachSource(data as TechDetectionResult, source);
}