import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  LEAD_API_SCHEMA_VERSION,
  type LeadSubmission,
  type LeadSubmissionEnvelope,
  type LeadSubmissionListEnvelope,
  type PreferredContactMethod,
} from '../src/app/core/services/lead-contract';

type LeadRow = {
  id: string;
  submitted_at: string;
  name: string;
  email: string;
  company: string;
  role: string;
  process_description: string;
  preferred_contact_method: PreferredContactMethod;
  source_route: string;
  source_query_params: Record<string, string>;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

type LeadInsertPayload = Omit<LeadRow, 'id' | 'submitted_at'>;

const LEADS_TABLE = 'lead_submissions';
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

function createSupabaseAdminClient() {
  const url = process.env['LAB_SUPABASE_URL'];
  const serviceRoleKey = process.env['LAB_SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !serviceRoleKey) {
    throw new Error(
      'LAB_SUPABASE_URL and LAB_SUPABASE_SERVICE_ROLE_KEY are required for /api/leads.'
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
      'LAB_SUPABASE_URL and LAB_SUPABASE_ANON_KEY are required to verify tokens for /api/leads.'
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function extractBearerToken(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}

async function verifyToken(token: string): Promise<boolean> {
  const supabase = createSupabaseAnonClient();
  const { error } = await supabase.auth.getUser(token);
  return error === null;
}

function parseLimit(input: string | string[] | undefined): number {
  const rawValue = Array.isArray(input) ? input[0] : input;
  const parsedValue = Number.parseInt(rawValue ?? '', 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsedValue, MAX_LIMIT);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readRequiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function readNullableString(value: unknown, label: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new TypeError(`${label} must be a string or null.`);
  }

  return value;
}

function readPreferredContactMethod(value: unknown): PreferredContactMethod {
  if (value === 'email' || value === 'phone' || value === 'video') {
    return value;
  }

  throw new TypeError('preferredContactMethod must be email, phone, or video.');
}

function readStringRecord(value: unknown, label: string): Readonly<Record<string, string>> {
  if (!isRecord(value)) {
    throw new TypeError(`${label} must be a string map.`);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      readRequiredString(entryValue, `${label}.${key}`),
    ])
  );
}

function readSubmissionEnvelope(body: unknown): LeadSubmissionEnvelope {
  if (
    !isRecord(body) ||
    body['schemaVersion'] !== LEAD_API_SCHEMA_VERSION ||
    !isRecord(body['data'])
  ) {
    throw new Error('Invalid lead submission envelope.');
  }

  const data = body['data'];
  const source = data['source'];
  if (!isRecord(source) || !isRecord(source['utm']) || !isRecord(source['queryParams'])) {
    throw new Error('Invalid lead source payload.');
  }

  return {
    schemaVersion: LEAD_API_SCHEMA_VERSION,
    data: {
      id: 'pending-id',
      submittedAt: 'pending-date',
      name: readRequiredString(data['name'], 'name'),
      email: readRequiredString(data['email'], 'email'),
      company: readRequiredString(data['company'], 'company'),
      role: readRequiredString(data['role'], 'role'),
      processDescription: readRequiredString(data['processDescription'], 'processDescription'),
      preferredContactMethod: readPreferredContactMethod(data['preferredContactMethod']),
      source: {
        route: readRequiredString(source['route'], 'source.route'),
        queryParams: readStringRecord(source['queryParams'], 'source.queryParams'),
        utm: {
          source: readNullableString(source['utm']['source'], 'source.utm.source'),
          medium: readNullableString(source['utm']['medium'], 'source.utm.medium'),
          campaign: readNullableString(source['utm']['campaign'], 'source.utm.campaign'),
          term: readNullableString(source['utm']['term'], 'source.utm.term'),
          content: readNullableString(source['utm']['content'], 'source.utm.content'),
        },
      },
    },
  };
}

function mapLeadInsertPayload(submission: LeadSubmission): LeadInsertPayload {
  return {
    name: submission.name,
    email: submission.email,
    company: submission.company,
    role: submission.role,
    process_description: submission.processDescription,
    preferred_contact_method: submission.preferredContactMethod,
    source_route: submission.source.route,
    source_query_params: { ...submission.source.queryParams },
    utm_source: submission.source.utm.source,
    utm_medium: submission.source.utm.medium,
    utm_campaign: submission.source.utm.campaign,
    utm_term: submission.source.utm.term,
    utm_content: submission.source.utm.content,
  };
}

function mapLeadRow(row: LeadRow): LeadSubmission {
  return {
    id: row.id,
    submittedAt: row.submitted_at,
    name: row.name,
    email: row.email,
    company: row.company,
    role: row.role,
    processDescription: row.process_description,
    preferredContactMethod: row.preferred_contact_method,
    source: {
      route: row.source_route,
      queryParams: row.source_query_params ?? {},
      utm: {
        source: row.utm_source,
        medium: row.utm_medium,
        campaign: row.utm_campaign,
        term: row.utm_term,
        content: row.utm_content,
      },
    },
  };
}

async function sendLeadNotification(submission: LeadSubmission): Promise<void> {
  const webhookUrl = process.env['LAB_LEAD_NOTIFICATION_WEBHOOK_URL'];
  if (!webhookUrl) {
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: `New lead: ${submission.name} (${submission.company}) via ${submission.source.route}`,
      lead: submission,
    }),
  });

  if (!response.ok) {
    throw new Error(`Lead notification failed with status ${response.status}.`);
  }
}

async function handleGet(
  req: VercelRequest,
  res: VercelResponse,
  supabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const limit = parseLimit(req.query['limit']);
  const { data, error } = await supabase
    .from(LEADS_TABLE)
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to list leads: ${error.message}`);
  }

  const response: LeadSubmissionListEnvelope = {
    schemaVersion: LEAD_API_SCHEMA_VERSION,
    data: (data ?? []).map(mapLeadRow),
  };

  res.status(200).json(response);
}

async function handlePost(
  req: VercelRequest,
  res: VercelResponse,
  supabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<void> {
  const envelope = readSubmissionEnvelope(req.body);
  const submissionPayload = mapLeadInsertPayload(envelope.data);

  const { data, error } = await supabase
    .from(LEADS_TABLE)
    .insert(submissionPayload)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create lead: ${error.message}`);
  }

  const submission = mapLeadRow(data);
  await sendLeadNotification(submission);

  const response: LeadSubmissionEnvelope = {
    schemaVersion: LEAD_API_SCHEMA_VERSION,
    data: submission,
  };

  res.status(201).json(response);
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    if (req.method === 'GET') {
      const token = extractBearerToken(req);
      if (!token) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const isValid = await verifyToken(token);
      if (!isValid) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const supabase = createSupabaseAdminClient();
      await handleGet(req, res, supabase);
      return;
    }

    if (req.method === 'POST') {
      const supabase = createSupabaseAdminClient();
      await handlePost(req, res, supabase);
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected /api/leads error.';
    res.status(500).json({ error: message });
  }
}
