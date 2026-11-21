export type ErrKind =
  | 'timeout' | 'rate-limited' | 'invalid-input' | 'blocked-target' | 'unreachable' | 'provider' | 'not-found';

export interface Ctx {
  request: Request;
  waitUntil(p: Promise<unknown>): void;
}

export class HttpError extends Error {
  kind: ErrKind;
  status: number;
  constructor(kind: ErrKind, status: number, message: string) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

export const fail = (kind: ErrKind, message: string, status: number, headers: Record<string, string> = {}) =>
  json({ error: { kind, message } }, status, headers);

export const toResponse = (e: unknown) =>
  e instanceof HttpError ? fail(e.kind, e.message, e.status) : fail('provider', 'Unexpected server error.', 500);

export const sourceInfo = (name = "Live request from NET Asia's server") => ({
  name,
  fetchedAt: new Date().toISOString(),
});