import type { ApiErrorBody, ApiResponse, PaginatedResponse } from '../types/api';

export const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === 'true';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const TOKEN_KEY = 'akuclass_token';

export type ApiErrorKind =
  | 'network' | 'unauthenticated' | 'forbidden' | 'not_found'
  | 'conflict' | 'validation' | 'server' | 'unknown';

const kindByStatus = (status: number): ApiErrorKind =>
  status === 401 ? 'unauthenticated' : status === 403 ? 'forbidden' : status === 404 ? 'not_found'
  : status === 409 ? 'conflict' : status === 400 || status === 422 ? 'validation'
  : status >= 500 ? 'server' : 'unknown';

const fallbackMessage: Record<ApiErrorKind, string> = {
  network: 'Unable to reach the server. Check your connection and try again.',
  unauthenticated: 'Your session has expired. Please sign in again.',
  forbidden: 'You do not have permission to do this.',
  not_found: 'The requested item was not found.',
  conflict: 'This change conflicts with existing data.',
  validation: 'Some of the information provided is not valid.',
  server: 'Something went wrong on our side. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

export class ApiError extends Error {
  constructor(public kind: ApiErrorKind, public status = 0, public code = 'UNKNOWN', message?: string) {
    super(message || fallbackMessage[kind]);
  }
}

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// The auth layer (Phase 4) registers a handler to redirect to /login on 401.
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => { onUnauthorized = fn; };

async function send(path: string, init: RequestInit = {}): Promise<unknown> {
  const token = tokenStore.get();
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
    });
  } catch {
    throw new ApiError('network');
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    if (res.status === 401) {
      tokenStore.clear();
      onUnauthorized?.();
    }
    throw new ApiError(kindByStatus(res.status), res.status, body?.error?.code, body?.error?.message);
  }
  if (res.status === 204) return undefined;
  return res.json();
}

export const apiGet = async <T>(path: string) => ((await send(path)) as ApiResponse<T>).data;
export const apiGetPage = async <T>(path: string) => (await send(path)) as PaginatedResponse<T>;
export const apiPatch = async <T>(path: string, body: unknown) =>
  ((await send(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })) as ApiResponse<T>).data;
