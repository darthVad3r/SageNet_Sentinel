import type { VercelRequest, VercelResponse } from '@vercel/node';

import type { WorkflowInput } from '../../src/app/core/services/workflow-contract';
import {
  WORKFLOW_SCHEMA_VERSION,
  createWorkflow,
  listWorkflowRuns,
  listWorkflows,
  triggerWorkflowRun,
  updateWorkflow,
} from '../_shared/workflow-data';
import {
  createSupabaseAdminClient,
  extractBearerToken,
  verifyBearerToken,
} from '../_shared/supabase-clients';

function parseSlug(req: VercelRequest): string[] {
  const raw = req.query['slug'];
  if (Array.isArray(raw)) {
    return raw;
  }

  if (typeof raw === 'string') {
    return [raw];
  }

  return [];
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

function readWorkflowInput(body: unknown): WorkflowInput {
  if (!isRecord(body)) {
    throw new TypeError('Workflow input must be an object.');
  }

  const steps = body['steps'];
  if (!Array.isArray(steps)) {
    throw new TypeError('steps must be an array.');
  }

  return {
    name: readRequiredString(body['name'], 'name'),
    description: readRequiredString(body['description'], 'description'),
    client: readRequiredString(body['client'], 'client'),
    stage: readRequiredString(body['stage'], 'stage') as WorkflowInput['stage'],
    status: readRequiredString(body['status'], 'status'),
    steps: steps.map((step, index) => {
      if (!isRecord(step)) {
        throw new TypeError(`steps[${index}] must be an object.`);
      }

      return {
        type: readRequiredString(
          step['type'],
          `steps[${index}].type`
        ) as WorkflowInput['steps'][number]['type'],
        owner: readRequiredString(step['owner'], `steps[${index}].owner`),
        description: readRequiredString(step['description'], `steps[${index}].description`),
      };
    }),
  };
}

function readPositiveInt(value: string | string[] | undefined, fallbackValue: number): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallbackValue;
  }

  return parsed;
}

function allowHeader(methods: string[]): string {
  return methods.join(', ');
}

async function authorizeRequest(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const token = extractBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized.' });
    return false;
  }

  const isValid = await verifyBearerToken(token);
  if (!isValid) {
    res.status(401).json({ error: 'Unauthorized.' });
    return false;
  }

  return true;
}

async function handleRootWorkflows(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const supabase = createSupabaseAdminClient();

  if (req.method === 'GET') {
    res.status(200).json({
      schemaVersion: WORKFLOW_SCHEMA_VERSION,
      data: await listWorkflows(supabase),
    });
    return true;
  }

  if (req.method === 'POST') {
    const created = await createWorkflow(supabase, readWorkflowInput(req.body));
    res.status(201).json({
      schemaVersion: WORKFLOW_SCHEMA_VERSION,
      data: created,
    });
    return true;
  }

  res.setHeader('Allow', allowHeader(['GET', 'POST']));
  res.status(405).json({ error: 'Method not allowed.' });
  return true;
}

async function handleWorkflowById(
  req: VercelRequest,
  res: VercelResponse,
  workflowId: string
): Promise<boolean> {
  const supabase = createSupabaseAdminClient();

  if (req.method !== 'PUT') {
    res.setHeader('Allow', allowHeader(['PUT']));
    res.status(405).json({ error: 'Method not allowed.' });
    return true;
  }

  const updated = await updateWorkflow(supabase, workflowId, readWorkflowInput(req.body));
  if (!updated) {
    res.status(404).json({ error: 'Workflow not found.' });
    return true;
  }

  res.status(200).json({
    schemaVersion: WORKFLOW_SCHEMA_VERSION,
    data: updated,
  });
  return true;
}

async function handleWorkflowRuns(
  req: VercelRequest,
  res: VercelResponse,
  workflowId: string
): Promise<boolean> {
  const supabase = createSupabaseAdminClient();

  if (req.method === 'POST') {
    const run = await triggerWorkflowRun(supabase, workflowId);
    if (!run) {
      res.status(404).json({ error: 'Workflow not found.' });
      return true;
    }

    res.status(201).json({
      schemaVersion: WORKFLOW_SCHEMA_VERSION,
      data: run,
    });
    return true;
  }

  if (req.method === 'GET') {
    const page = readPositiveInt(req.query['page'], 1);
    const pageSize = readPositiveInt(req.query['pageSize'], 10);
    const runPage = await listWorkflowRuns(supabase, workflowId, page, pageSize);
    if (!runPage) {
      res.status(404).json({ error: 'Workflow not found.' });
      return true;
    }

    res.status(200).json({
      schemaVersion: WORKFLOW_SCHEMA_VERSION,
      total: runPage.total,
      page: runPage.page,
      pageSize: runPage.pageSize,
      data: runPage.data,
    });
    return true;
  }

  res.setHeader('Allow', allowHeader(['GET', 'POST']));
  res.status(405).json({ error: 'Method not allowed.' });
  return true;
}

async function dispatchByRoute(req: VercelRequest, res: VercelResponse): Promise<void> {
  const slug = parseSlug(req);
  const workflowId = slug[0];

  if (slug.length === 0) {
    await handleRootWorkflows(req, res);
    return;
  }

  if (slug.length === 1 && workflowId) {
    await handleWorkflowById(req, res, workflowId);
    return;
  }

  if (slug.length === 2 && slug[1] === 'runs' && workflowId) {
    await handleWorkflowRuns(req, res, workflowId);
    return;
  }

  res.status(404).json({ error: 'Not found.' });
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const isAuthorized = await authorizeRequest(req, res);
    if (!isAuthorized) {
      return;
    }

    await dispatchByRoute(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected /api/workflows error.';
    res.status(500).json({ error: message });
  }
}
