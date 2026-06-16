import type { VercelRequest, VercelResponse } from '@vercel/node';

import { dashboardSummaryEnvelope } from '../_shared/workflow-data';
import {
  createSupabaseAdminClient,
  extractBearerToken,
  verifyBearerToken,
} from '../_shared/supabase-clients';

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

    const supabase = createSupabaseAdminClient();
    res.status(200).json(await dashboardSummaryEnvelope(supabase));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected /api/dashboard/summary error.';
    res.status(500).json({ error: message });
  }
}
