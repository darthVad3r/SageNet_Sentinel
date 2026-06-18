import type { VercelRequest, VercelResponse } from '@vercel/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import handler from '../../api/dashboard/recent-runs';

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

function jsonResponse(payload: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  });
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

function sortedKeys(value: Record<string, unknown>): string[] {
  return Object.keys(value).sort((left, right) => left.localeCompare(right));
}

describe('dashboard recent-runs API handler', () => {
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
      {
        method: 'POST',
        url: '/api/dashboard/recent-runs',
        query: {},
        headers: { 'x-request-id': 'req-runs-1' },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.headers['Allow']).toBe('GET');
    expect(response.headers['X-Request-ID']).toBe('req-runs-1');
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({ error: 'Method not allowed.' });
  });

  it('rejects requests with missing bearer token', async () => {
    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/dashboard/recent-runs',
        query: {},
        headers: { 'x-request-id': 'req-runs-2' },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized.' });
  });

  it('rejects requests with invalid bearer token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ message: 'invalid JWT' }, 401))
    );

    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/dashboard/recent-runs',
        query: {},
        headers: {
          authorization: 'Bearer bad-token',
          'x-request-id': 'req-runs-3',
        },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized.' });
  });

  it('uses page and pageSize query values when provided', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = requestUrl(input);
      const method = init?.method ?? 'GET';

      if (url.includes('/auth/v1/user')) {
        return jsonResponse({ id: 'user-1' }, 200);
      }

      if (url.includes('/rest/v1/workflow_runs')) {
        return jsonResponse(
          [
            {
              id: 'run-1',
              workflow_id: 'wf-1',
              status: 'queued',
              triggered_at: '2026-06-15T12:30:00.000Z',
              started_at: null,
              completed_at: null,
              summary: 'Queued.',
            },
          ],
          200,
          { 'content-range': '0-0/1' }
        );
      }

      if (url.includes('/rest/v1/workflows')) {
        return jsonResponse([{ id: 'wf-1', name: 'Lead Qualification' }], 200);
      }

      return jsonResponse({ message: `Unhandled request: ${method} ${url}` }, 500);
    });

    vi.stubGlobal('fetch', fetchMock);

    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/dashboard/recent-runs?page=2&pageSize=25',
        query: {
          page: '2',
          pageSize: '25',
        },
        headers: {
          authorization: 'Bearer valid-token',
          'x-request-id': 'req-runs-4',
        },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(200);
    const payload = response.body as Record<string, unknown>;
    expect(sortedKeys(payload)).toEqual(['data', 'schemaVersion']);
    expect(payload['schemaVersion']).toBe('2026-06-14');

    const data = payload['data'] as Record<string, unknown>;
    expect(sortedKeys(data)).toEqual(['data', 'page', 'pageSize', 'total']);
    expect(data).toMatchObject({
      page: 2,
      pageSize: 25,
      total: 1,
    });

    const runs = data['data'] as Array<Record<string, unknown>>;
    expect(runs.length).toBe(1);
    expect(sortedKeys(runs[0] ?? {})).toEqual([
      'completedAt',
      'runId',
      'status',
      'triggeredAt',
      'workflowId',
      'workflowName',
    ]);
    expect(runs[0]).toMatchObject({
      runId: 'run-1',
      workflowId: 'wf-1',
    });
  });

  it('falls back to defaults and supports legacy limit alias', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = requestUrl(input);

      if (url.includes('/auth/v1/user')) {
        return jsonResponse({ id: 'user-1' }, 200);
      }

      if (url.includes('/rest/v1/workflow_runs')) {
        return jsonResponse([], 200, { 'content-range': '0-0/0' });
      }

      if (url.includes('/rest/v1/workflows')) {
        return jsonResponse([], 200);
      }

      return jsonResponse({ message: `Unhandled request: ${url}` }, 500);
    });

    vi.stubGlobal('fetch', fetchMock);

    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/dashboard/recent-runs?limit=500&page=abc',
        query: {
          page: 'abc',
          limit: '500',
        },
        headers: {
          authorization: 'Bearer valid-token',
          'x-request-id': 'req-runs-5',
        },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(200);
    const payload = response.body as Record<string, unknown>;
    expect(sortedKeys(payload)).toEqual(['data', 'schemaVersion']);

    const data = payload['data'] as Record<string, unknown>;
    expect(sortedKeys(data)).toEqual(['data', 'page', 'pageSize', 'total']);
    expect(data).toMatchObject({
      page: 1,
      pageSize: 50,
    });
  });

  it('returns 500 when admin client cannot be created', async () => {
    delete process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ id: 'user-1' }, 200)));

    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/dashboard/recent-runs',
        query: {},
        headers: {
          authorization: 'Bearer valid-token',
          'x-request-id': 'req-runs-6',
        },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error:
        'LAB_SUPABASE_URL and LAB_SUPABASE_SERVICE_ROLE_KEY are required for workflow/dashboard APIs.',
    });
  });
});
