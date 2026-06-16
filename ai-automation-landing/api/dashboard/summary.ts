import type { VercelRequest, VercelResponse } from '@vercel/node';

import { ApiLogger, AuthLogger } from '../_shared/logger';
import {
  createSupabaseAdminClient,
  extractBearerToken,
  verifyBearerToken,
} from '../_shared/supabase-clients';
import { dashboardSummaryEnvelope } from '../_shared/workflow-data';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = ApiLogger.getRequestId(req);
  const startTime = Date.now();
  const method = req.method ?? 'UNKNOWN';
  const path = req.url ?? '/api/dashboard/summary';

  res.setHeader('X-Request-ID', requestId);
  ApiLogger.logInfo('dashboard:summary', `Incoming ${method} ${path}`, {}, requestId);

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

    const supabase = createSupabaseAdminClient();
    res.status(200).json(await dashboardSummaryEnvelope(supabase));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected /api/dashboard/summary error.';

    ApiLogger.logError(
      'dashboard:summary',
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
