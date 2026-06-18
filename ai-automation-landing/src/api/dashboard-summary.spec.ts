import type { VercelRequest, VercelResponse } from '@vercel/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import handler from '../../api/dashboard/summary';

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

describe('dashboard summary API handler', () => {
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
        url: '/api/dashboard/summary',
        query: {},
        headers: { 'x-request-id': 'req-summary-1' },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.headers['Allow']).toBe('GET');
    expect(response.headers['X-Request-ID']).toBe('req-summary-1');
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({ error: 'Method not allowed.' });
  });

  it('rejects requests with missing bearer token', async () => {
    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/dashboard/summary',
        query: {},
        headers: { 'x-request-id': 'req-summary-2' },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.headers['X-Request-ID']).toBe('req-summary-2');
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
        url: '/api/dashboard/summary',
        query: {},
        headers: {
          authorization: 'Bearer bad-token',
          'x-request-id': 'req-summary-3',
        },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized.' });
  });

  it('returns summary envelope for authorized requests', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = requestUrl(input);
      const method = init?.method ?? 'GET';

      if (url.includes('/auth/v1/user')) {
        return jsonResponse({ id: 'user-1' }, 200);
      }

      if (
        url.includes('/rest/v1/workflows') &&
        method === 'HEAD' &&
        url.includes('status=eq.active')
      ) {
        return new Response(null, { status: 200, headers: { 'content-range': '0-0/2' } });
      }

      if (url.includes('/rest/v1/workflows') && method === 'HEAD') {
        return new Response(null, { status: 200, headers: { 'content-range': '0-0/3' } });
      }

      if (url.includes('/rest/v1/workflows') && url.includes('select=stage')) {
        return jsonResponse([{ stage: 'live' }, { stage: 'discovery' }], 200);
      }

      if (
        url.includes('/rest/v1/workflows') &&
        url.includes('select=id%2Cname%2Cestimated_minutes_saved_per_run')
      ) {
        return jsonResponse(
          [
            { id: 'wf-1', name: 'Lead Qualification', estimated_minutes_saved_per_run: 30 },
            { id: 'wf-2', name: 'Renewal Follow-up', estimated_minutes_saved_per_run: 15 },
          ],
          200
        );
      }

      if (url.includes('/rest/v1/workflow_runs') && url.includes('select=status')) {
        return jsonResponse(
          [
            { status: 'queued', workflow_id: 'wf-1' },
            { status: 'succeeded', workflow_id: 'wf-1' },
          ],
          200
        );
      }

      if (url.includes('/rest/v1/lead_submissions') && method === 'HEAD') {
        return new Response(null, { status: 200, headers: { 'content-range': '0-0/7' } });
      }

      return jsonResponse({ message: `Unhandled request: ${method} ${url}` }, 500);
    });

    vi.stubGlobal('fetch', fetchMock);

    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/dashboard/summary',
        query: {},
        headers: {
          authorization: 'Bearer valid-token',
          'x-request-id': 'req-summary-4',
        },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(200);

    const payload = response.body as Record<string, unknown>;
    expect(sortedKeys(payload)).toEqual(['data', 'schemaVersion']);
    expect(payload['schemaVersion']).toBe('2026-06-14');

    const data = payload['data'] as Record<string, unknown>;
    expect(sortedKeys(data)).toEqual([
      'activeWorkflowCount',
      'automationImpact',
      'failedRunCount',
      'hasImpactData',
      'leadCount',
      'queuedRunCount',
      'runningRunCount',
      'succeededRunCount',
      'totalEstimatedHoursSaved',
      'totalRunCount',
      'workflowCount',
      'workflowsByStage',
    ]);
    expect(data).toMatchObject({
      leadCount: 7,
      workflowCount: 3,
      activeWorkflowCount: 2,
      queuedRunCount: 1,
      runningRunCount: 0,
      succeededRunCount: 1,
      failedRunCount: 0,
      totalRunCount: 2,
      totalEstimatedHoursSaved: 1,
      hasImpactData: true,
    });

    const workflowsByStage = data['workflowsByStage'] as Array<Record<string, unknown>>;
    expect(workflowsByStage.length).toBe(2);
    for (const stage of workflowsByStage) {
      expect(sortedKeys(stage)).toEqual(['count', 'stage']);
      expect(typeof stage['stage']).toBe('string');
      expect(typeof stage['count']).toBe('number');
    }

    const automationImpact = data['automationImpact'] as Array<Record<string, unknown>>;
    expect(automationImpact).toHaveLength(2);
    expect(automationImpact[0]).toMatchObject({
      workflowId: 'wf-1',
      workflowName: 'Lead Qualification',
      runCount: 2,
      estimatedMinutesSavedPerRun: 30,
      estimatedHoursSaved: 1,
    });
  });

  it('returns 500 when admin client cannot be created', async () => {
    delete process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ id: 'user-1' }, 200)));

    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/dashboard/summary',
        query: {},
        headers: {
          authorization: 'Bearer valid-token',
          'x-request-id': 'req-summary-5',
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
