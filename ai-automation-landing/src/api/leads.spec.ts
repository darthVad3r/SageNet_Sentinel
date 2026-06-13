import type { VercelRequest, VercelResponse } from '@vercel/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LEAD_API_SCHEMA_VERSION } from '../app/core/services/lead-contract';

const { createClientMock, fetchMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  fetchMock: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

import handler from '../../api/leads';

type MockResponse = {
  statusCode: number | null;
  headers: Record<string, string>;
  body: unknown;
  setHeader: ReturnType<typeof vi.fn>;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

const leadRow = {
  id: 'lead-123',
  submitted_at: '2026-06-11T13:00:00.000Z',
  name: 'Casey Client',
  email: 'casey@example.com',
  company: 'Orbit Labs',
  role: 'Operations Lead',
  process_description: 'Manual follow-up workflow and spreadsheet-based handoff tracking.',
  preferred_contact_method: 'email' as const,
  source_route: '/book',
  source_query_params: {
    utm_source: 'newsletter',
    utm_campaign: 'summer-launch',
  },
  utm_source: 'newsletter',
  utm_medium: 'email',
  utm_campaign: 'summer-launch',
  utm_term: null,
  utm_content: null,
};

beforeEach(() => {
  createClientMock.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);

  process.env['LAB_SUPABASE_URL'] = 'https://example.supabase.co';
  process.env['LAB_SUPABASE_ANON_KEY'] = 'anon-key';
  process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'] = 'service-role-key';
  process.env['LAB_LEAD_NOTIFICATION_WEBHOOK_URL'] = 'https://hooks.example.com/lead';
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env['LAB_SUPABASE_URL'];
  delete process.env['LAB_SUPABASE_ANON_KEY'];
  delete process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'];
  delete process.env['LAB_LEAD_NOTIFICATION_WEBHOOK_URL'];
});

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

describe('lead API handler', () => {
  it('lists submissions with the expected envelope', async () => {
    const queryMock = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [leadRow], error: null }),
    };

    const fromMock = vi.fn().mockReturnValue(queryMock);
    const getUserMock = vi
      .fn()
      .mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    createClientMock
      .mockReturnValueOnce({ auth: { getUser: getUserMock } }) // anon client for token verify
      .mockReturnValueOnce({ from: fromMock }); // admin client for query

    const response = createMockResponse();
    await handler(
      {
        method: 'GET',
        query: { limit: '5' },
        headers: { authorization: 'Bearer valid-token' },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(getUserMock).toHaveBeenCalledWith('valid-token');
    expect(fromMock).toHaveBeenCalledWith('lead_submissions');
    expect(queryMock.limit).toHaveBeenCalledWith(5);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      schemaVersion: LEAD_API_SCHEMA_VERSION,
      data: [
        {
          id: 'lead-123',
          submittedAt: '2026-06-11T13:00:00.000Z',
          name: 'Casey Client',
          email: 'casey@example.com',
          company: 'Orbit Labs',
          role: 'Operations Lead',
          processDescription: 'Manual follow-up workflow and spreadsheet-based handoff tracking.',
          preferredContactMethod: 'email',
          source: {
            route: '/book',
            queryParams: {
              utm_source: 'newsletter',
              utm_campaign: 'summer-launch',
            },
            utm: {
              source: 'newsletter',
              medium: 'email',
              campaign: 'summer-launch',
              term: null,
              content: null,
            },
          },
        },
      ],
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects GET requests with no authorization header', async () => {
    createClientMock.mockReturnValue({ from: vi.fn() });

    const response = createMockResponse();
    await handler(
      {
        method: 'GET',
        query: {},
        headers: {},
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized.' });
  });

  it('rejects GET requests when the token is invalid', async () => {
    const getUserMock = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'invalid JWT' },
    });
    createClientMock.mockReturnValue({ auth: { getUser: getUserMock } });

    const response = createMockResponse();
    await handler(
      {
        method: 'GET',
        query: {},
        headers: { authorization: 'Bearer bad-token' },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized.' });
  });

  it('creates a submission and notifies the webhook', async () => {
    const insertMock = {
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: leadRow, error: null }),
    };

    const fromMock = vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue(insertMock),
    });
    createClientMock.mockReturnValue({ from: fromMock });
    fetchMock.mockResolvedValue({ ok: true, status: 200 });

    const response = createMockResponse();
    await handler(
      {
        method: 'POST',
        query: {},
        body: {
          schemaVersion: LEAD_API_SCHEMA_VERSION,
          data: {
            name: 'Casey Client',
            email: 'casey@example.com',
            company: 'Orbit Labs',
            role: 'Operations Lead',
            processDescription:
              'We manually coordinate sales follow-up and project handoff work across email and spreadsheets.',
            preferredContactMethod: 'email',
            source: {
              route: '/book',
              queryParams: {
                utm_source: 'newsletter',
                utm_campaign: 'summer-launch',
              },
              utm: {
                source: 'newsletter',
                medium: 'email',
                campaign: 'summer-launch',
                term: null,
                content: null,
              },
            },
          },
        },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(fromMock).toHaveBeenCalledWith('lead_submissions');
    expect(insertMock.select).toHaveBeenCalledWith('*');
    expect(response.statusCode).toBe(201);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://hooks.example.com/lead',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
    expect(response.body).toMatchObject({
      schemaVersion: LEAD_API_SCHEMA_VERSION,
      data: {
        id: 'lead-123',
        source: {
          route: '/book',
        },
      },
    });
  });

  it('rejects malformed submission envelopes', async () => {
    const fromMock = vi.fn();
    createClientMock.mockReturnValue({ from: fromMock });

    const response = createMockResponse();
    await handler(
      {
        method: 'POST',
        query: {},
        body: {
          schemaVersion: LEAD_API_SCHEMA_VERSION,
          data: {
            name: 'Casey Client',
          },
        },
      } as unknown as VercelRequest,
      response as unknown as VercelResponse
    );

    expect(fromMock).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Invalid lead source payload.' });
  });
});
