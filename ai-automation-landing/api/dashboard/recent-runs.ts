import type { VercelRequest, VercelResponse } from '@vercel/node';

import { ApiLogger, AuthLogger } from '../_shared/logger';
import {
  createSupabaseAdminClient,
  extractBearerToken,
  verifyBearerToken,
} from '../_shared/supabase-clients';
import { dashboardRecentRunsEnvelope } from '../_shared/workflow-data';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function parsePositiveInteger(input: string | string[] | undefined, fallback: number): number {
  const rawValue = Array.isArray(input) ? input[0] : input;
  const parsedValue = Number.parseInt(rawValue ?? '', 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

function parsePage(input: string | string[] | undefined): number {
  return parsePositiveInteger(input, DEFAULT_PAGE);
}

function parsePageSize(req: VercelRequest): number {
  // Support legacy ?limit= for backward compatibility while preferring pageSize.
  const pageSizeInput = req.query['pageSize'] ?? req.query['limit'];
  return Math.min(parsePositiveInteger(pageSizeInput, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = ApiLogger.getRequestId(req);
  const startTime = Date.now();
  const method = req.method ?? 'UNKNOWN';
  const path = req.url ?? '/api/dashboard/recent-runs';

  res.setHeader('X-Request-ID', requestId);
  ApiLogger.logInfo('dashboard:recent-runs', `Incoming ${method} ${path}`, {}, requestId);

  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    }

    const token = extractBearerToken(req);
    if (!token) {
      AuthLogger.logTokenValidation(false, requestId);
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const isValid = await verifyBearerToken(token);
    if (!isValid) {
      AuthLogger.logTokenValidation(false, requestId);
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }
    AuthLogger.logTokenValidation(true, requestId);

    const page = parsePage(req.query['page']);
    const pageSize = parsePageSize(req);
    ApiLogger.logInfo(
      'dashboard:recent-runs',
      'Resolved pagination options',
      { page, pageSize },
      requestId
    );

    const supabase = createSupabaseAdminClient();
    res.status(200).json(await dashboardRecentRunsEnvelope(supabase, page, pageSize));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected /api/dashboard/recent-runs error.';

    ApiLogger.logError(
      'dashboard:recent-runs',
      message,
      error instanceof Error ? error : undefined,
      undefined,
      requestId
    );
    res.status(500).json({ error: message });
  } finally {
    ApiLogger.logRequestMetrics(
      {
        method,
        path,
        statusCode: res.statusCode,
        duration: Date.now() - startTime,
      },
      requestId
    );
  }
}
