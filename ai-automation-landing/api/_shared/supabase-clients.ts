import { createClient } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';

export function createSupabaseAdminClient() {
  const url = process.env['LAB_SUPABASE_URL'];
  const serviceRoleKey = process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !serviceRoleKey) {
    throw new Error(
      'LAB_SUPABASE_URL and LAB_SUPABASE_SERVICE_ROLE_KEY are required for workflow/dashboard APIs.'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function createSupabaseAnonClient() {
  const url = process.env['LAB_SUPABASE_URL'];
  const anonKey = process.env['LAB_SUPABASE_ANON_KEY'];

  if (!url || !anonKey) {
    throw new Error(
      'LAB_SUPABASE_URL and LAB_SUPABASE_ANON_KEY are required to verify tokens for workflow/dashboard APIs.'
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function extractBearerToken(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}

export async function verifyBearerToken(token: string): Promise<boolean> {
  const supabase = createSupabaseAnonClient();
  const { error } = await supabase.auth.getUser(token);
  return error === null;
}
