import type { VercelRequest, VercelResponse } from '@vercel/node';

import { dashboardRecentRunsEnvelope } from '../_shared/workflow-data';
import {
  createSupabaseAdminClient,
  extractBearerToken,
  verifyBearerToken,
} from '../_shared/supabase-clients';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parseLimit(input: string | string[] | undefined): number {
  const rawValue = Array.isArray(input) ? input[0] : input;
  const parsedValue = Number.parseInt(rawValue ?? '', 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsedValue, MAX_LIMIT);
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    }

    const token = extractBearerToken(req);
    if (!token) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const isValid = await verifyBearerToken(token);
    if (!isValid) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const limit = parseLimit(req.query['limit']);
    const supabase = createSupabaseAdminClient();
    res.status(200).json(await dashboardRecentRunsEnvelope(supabase, limit));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected /api/dashboard/recent-runs error.';
    res.status(500).json({ error: message });
  }
}
