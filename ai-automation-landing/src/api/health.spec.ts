import type { VercelRequest, VercelResponse } from '@vercel/node';
import { describe, expect, it, vi } from 'vitest';

import handler from '../../api/health';

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

describe('health API handler', () => {
  it('rejects non-GET methods', async () => {
    const response = createMockResponse();

    await handler(
      {
        method: 'POST',
        url: '/api/health',
        query: {},
        headers: { 'x-request-id': 'req-health-1' },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.headers['Allow']).toBe('GET');
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({ error: 'Method not allowed.' });
  });

  it('returns liveness payload for GET requests', async () => {
    const response = createMockResponse();

    await handler(
      {
        method: 'GET',
        url: '/api/health',
        query: {},
        headers: { 'x-request-id': 'req-health-2' },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.headers['X-Request-ID']).toBe('req-health-2');
    expect(response.statusCode).toBe(200);

    const payload = response.body as Record<string, unknown>;
    expect(payload['status']).toBe('ok');
    expect(payload['service']).toBe('workflow-api');
    expect(typeof payload['timestamp']).toBe('string');
    expect(typeof payload['uptimeSeconds']).toBe('number');
  });
});
