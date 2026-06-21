import type { VercelRequest, VercelResponse } from '@vercel/node';

import { ApiLogger } from './_shared/logger';

function readEnvironment(): string {
  return process.env['VERCEL_ENV'] ?? process.env['NODE_ENV'] ?? 'development';
}

function readRevision(): string | null {
  return process.env['VERCEL_GIT_COMMIT_SHA'] ?? process.env['GITHUB_SHA'] ?? null;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = ApiLogger.getRequestId(req);
  const startTime = Date.now();
  const method = req.method ?? 'UNKNOWN';
  const path = req.url ?? '/api/health';

  res.setHeader('X-Request-ID', requestId);

  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    }

    res.status(200).json({
      status: 'ok',
      service: 'workflow-api',
      environment: readEnvironment(),
      revision: readRevision(),
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected /api/health error.';
    ApiLogger.logError(
      'health',
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
