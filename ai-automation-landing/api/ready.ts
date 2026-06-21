import type { VercelRequest, VercelResponse } from '@vercel/node';

import { ApiLogger } from './_shared/logger';
import { createSupabaseAdminClient } from './_shared/supabase-clients';

type ReadinessCheck = {
  readonly status: 'pass' | 'fail';
  readonly detail: string;
};

function readRequiredEnvStatus(): { check: ReadinessCheck; missing: string[] } {
  const requiredEnvVars = [
    'LAB_SUPABASE_URL',
    'LAB_SUPABASE_ANON_KEY',
    'LAB_SUPABASE_SERVICE_ROLE_KEY',
  ] as const;

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missing.length > 0) {
    return {
      check: {
        status: 'fail',
        detail: `Missing required environment variables: ${missing.join(', ')}`,
      },
      missing,
    };
  }

  return {
    check: {
      status: 'pass',
      detail: 'Required environment variables are configured.',
    },
    missing: [],
  };
}

async function checkSupabase(): Promise<ReadinessCheck> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('workflows').select('id', { head: true, count: 'exact' });

  if (error) {
    return {
      status: 'fail',
      detail: `Supabase readiness query failed: ${error.message}`,
    };
  }

  return {
    status: 'pass',
    detail: 'Supabase connectivity verified.',
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = ApiLogger.getRequestId(req);
  const startTime = Date.now();
  const method = req.method ?? 'UNKNOWN';
  const path = req.url ?? '/api/ready';

  res.setHeader('X-Request-ID', requestId);

  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    }

    const envStatus = readRequiredEnvStatus();
    const checks: Record<string, ReadinessCheck> = {
      environment: envStatus.check,
    };

    if (envStatus.missing.length === 0) {
      checks['supabase'] = await checkSupabase();
    } else {
      checks['supabase'] = {
        status: 'fail',
        detail: 'Skipped because required environment variables are missing.',
      };
    }

    const isReady = Object.values(checks).every((check) => check.status === 'pass');

    res.status(isReady ? 200 : 503).json({
      status: isReady ? 'ready' : 'not_ready',
      service: 'workflow-api',
      timestamp: new Date().toISOString(),
      checks,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected /api/ready error.';
    ApiLogger.logError(
      'ready',
      message,
      error instanceof Error ? error : undefined,
      undefined,
      requestId
    );
    res.status(503).json({
      status: 'not_ready',
      service: 'workflow-api',
      timestamp: new Date().toISOString(),
      checks: {
        application: {
          status: 'fail',
          detail: message,
        },
      },
    });
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
