import type { VercelRequest, VercelResponse } from '@vercel/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import handler from '../../api/ready';

type MockResponse = {
  statusCode: number | null;
  headers: Record<string, string>;
  body: unknown;
  setHeader: ReturnType<typeof vi.fn>;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

function createMockResponse(): MockResponse {
  const response: MockResponse = {
    statusCode: null,
    headers: {},
    body: undefined,
    setHeader: vi.fn((name: string, value: string) => {
      response.headers[name] = value;
    }),
    status: vi.fn((code: number) => {
      response.statusCode = code;
      return response;
    }),
    json: vi.fn((payload: unknown) => {
      response.body = payload;
      return response;
    }),
  };

  return response;
}

function createMockRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'GET',
    url: '/api/ready',
    query: {},
    headers: {},
    ...overrides,
  } as unknown as VercelRequest;
}

function requestUrl(input: string | URL | Request): string {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

describe('ready API handler', () => {
  beforeEach(() => {
    process.env['LAB_SUPABASE_URL'] = 'https://example.supabase.co';
    process.env['LAB_SUPABASE_ANON_KEY'] = 'anon-key';
    process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'] = 'service-role-key';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env['LAB_SUPABASE_URL'];
    delete process.env['LAB_SUPABASE_ANON_KEY'];
    delete process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'];
  });

  it('rejects non-GET methods', async () => {
    const response = createMockResponse();

    await handler(
      createMockRequest({
        method: 'POST',
        headers: { 'x-request-id': 'req-ready-1' },
      }),
      response as unknown as VercelResponse
    );

    expect(response.headers['Allow']).toBe('GET');
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({ error: 'Method not allowed.' });
  });

  it('returns 503 when required environment variables are missing', async () => {
    delete process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'];

    const response = createMockResponse();

    await handler(
      createMockRequest({
        headers: { 'x-request-id': 'req-ready-2' },
      }),
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(503);

    const payload = response.body as Record<string, unknown>;
    expect(payload['status']).toBe('not_ready');

    const checks = payload['checks'] as Record<string, Record<string, string>>;
    expect(checks['environment']?.['status']).toBe('fail');
    expect(checks['supabase']?.['status']).toBe('fail');
  });

  it('returns 200 when configuration and Supabase connectivity are healthy', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = requestUrl(input);

        if (url.includes('/rest/v1/workflows')) {
          return new Response(null, {
            status: 200,
            headers: { 'content-range': '0-0/1' },
          });
        }

        return new Response(JSON.stringify({ message: `Unhandled request: ${url}` }), {
          status: 500,
          headers: { 'content-type': 'application/json' },
        });
      })
    );

    const response = createMockResponse();

    await handler(
      createMockRequest({
        headers: { 'x-request-id': 'req-ready-3' },
      }),
      response as unknown as VercelResponse
    );

    expect(response.headers['X-Request-ID']).toBe('req-ready-3');
    expect(response.statusCode).toBe(200);

    const payload = response.body as Record<string, unknown>;
    expect(payload['status']).toBe('ready');

    const checks = payload['checks'] as Record<string, Record<string, string>>;
    expect(checks['environment']?.['status']).toBe('pass');
    expect(checks['supabase']?.['status']).toBe('pass');
  });
});
