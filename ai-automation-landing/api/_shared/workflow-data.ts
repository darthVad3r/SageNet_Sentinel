import type { SupabaseClient } from '@supabase/supabase-js';

import {
  DASHBOARD_API_SCHEMA_VERSION,
  type DashboardRecentRun,
  type DashboardSummary,
} from '../../src/app/core/services/dashboard-contract';
import {
  type Workflow,
  type WorkflowInput,
  type WorkflowRun,
  type WorkflowRunStatus,
  type WorkflowStage,
  type WorkflowStageChange,
  type WorkflowStep,
} from '../../src/app/core/services/workflow-contract';

const WORKFLOWS_TABLE = 'workflows';
const WORKFLOW_RUNS_TABLE = 'workflow_runs';
const LEADS_TABLE = 'lead_submissions';

interface WorkflowRow {
  id: string;
  name: string;
  description: string;
  client: string;
  stage: string;
  status: string;
  created_at: string;
  updated_at: string;
  steps_json: unknown;
  stage_history_json: unknown;
}

interface WorkflowRunRow {
  id: string;
  workflow_id: string;
  status: string;
  triggered_at: string;
  started_at: string | null;
  completed_at: string | null;
  summary: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

function parseRecordArray(value: unknown, label: string): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array.`);
  }

  return value.map((entry, index) => {
    if (typeof entry !== 'object' || entry === null) {
      throw new TypeError(`${label}[${index}] must be an object.`);
    }

    return entry as Record<string, unknown>;
  });
}

function readString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${label} must be a non-empty string.`);
  }

  return value;
}

function readNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a number.`);
  }

  return value;
}

function mapWorkflowRow(row: WorkflowRow): Workflow {
  const steps = parseRecordArray(row.steps_json, 'workflows.steps_json').map((entry, index) => ({
    id: readString(entry['id'], `steps_json[${index}].id`),
    order: readNumber(entry['order'], `steps_json[${index}].order`),
    type: readString(entry['type'], `steps_json[${index}].type`) as WorkflowStep['type'],
    description: readString(entry['description'], `steps_json[${index}].description`),
    owner: readString(entry['owner'], `steps_json[${index}].owner`),
  }));

  const stageHistory = parseRecordArray(row.stage_history_json, 'workflows.stage_history_json').map(
    (entry, index) => ({
      stage: readString(entry['stage'], `stage_history_json[${index}].stage`) as WorkflowStage,
      changedAt: readString(entry['changedAt'], `stage_history_json[${index}].changedAt`),
      actor: readString(entry['actor'], `stage_history_json[${index}].actor`),
    })
  );

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    client: row.client,
    stage: row.stage as WorkflowStage,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    steps,
    stageHistory,
  };
}

function mapWorkflowRunRow(row: WorkflowRunRow): WorkflowRun {
  return {
    id: row.id,
    workflowId: row.workflow_id,
    status: row.status as WorkflowRunStatus,
    triggeredAt: row.triggered_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    summary: row.summary,
  };
}

function makeStepsJson(input: WorkflowInput): WorkflowStep[] {
  return input.steps.map((step, index) => ({
    id: crypto.randomUUID(),
    order: index,
    type: step.type,
    description: step.description,
    owner: step.owner,
  }));
}

function makeStageHistoryJson(stage: WorkflowStage): WorkflowStageChange[] {
  return [
    {
      stage,
      changedAt: nowIso(),
      actor: 'api',
    },
  ];
}

function throwSupabaseError(error: { message: string }, context: string): never {
  throw new Error(`${context}: ${error.message}`);
}

export async function listWorkflows(supabase: SupabaseClient): Promise<readonly Workflow[]> {
  const { data, error } = await supabase
    .from(WORKFLOWS_TABLE)
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throwSupabaseError(error, 'Failed to list workflows');
  }

  return (data ?? []).map((row) => mapWorkflowRow(row as WorkflowRow));
}

export async function createWorkflow(
  supabase: SupabaseClient,
  input: WorkflowInput
): Promise<Workflow> {
  const createdAt = nowIso();
  const stepsJson = makeStepsJson(input);
  const stageHistoryJson = makeStageHistoryJson(input.stage);

  const { data, error } = await supabase
    .from(WORKFLOWS_TABLE)
    .insert({
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      client: input.client,
      stage: input.stage,
      status: input.status,
      created_at: createdAt,
      updated_at: createdAt,
      steps_json: stepsJson,
      stage_history_json: stageHistoryJson,
    })
    .select('*')
    .single();

  if (error) {
    throwSupabaseError(error, 'Failed to create workflow');
  }

  return mapWorkflowRow(data as WorkflowRow);
}

export async function updateWorkflow(
  supabase: SupabaseClient,
  workflowId: string,
  input: WorkflowInput
): Promise<Workflow | null> {
  const { data: existing, error: selectError } = await supabase
    .from(WORKFLOWS_TABLE)
    .select('*')
    .eq('id', workflowId)
    .maybeSingle();

  if (selectError) {
    throwSupabaseError(selectError, 'Failed to load workflow for update');
  }

  if (!existing) {
    return null;
  }

  const existingRow = existing as WorkflowRow;
  const stageHistory = parseRecordArray(existingRow.stage_history_json, 'stage_history_json').map(
    (entry) => ({
      stage: readString(entry['stage'], 'stage_history_json.stage') as WorkflowStage,
      changedAt: readString(entry['changedAt'], 'stage_history_json.changedAt'),
      actor: readString(entry['actor'], 'stage_history_json.actor'),
    })
  );

  if (existingRow.stage !== input.stage) {
    stageHistory.push({
      stage: input.stage,
      changedAt: nowIso(),
      actor: 'api',
    });
  }

  const { data, error } = await supabase
    .from(WORKFLOWS_TABLE)
    .update({
      name: input.name,
      description: input.description,
      client: input.client,
      stage: input.stage,
      status: input.status,
      updated_at: nowIso(),
      steps_json: makeStepsJson(input),
      stage_history_json: stageHistory,
    })
    .eq('id', workflowId)
    .select('*')
    .single();

  if (error) {
    throwSupabaseError(error, 'Failed to update workflow');
  }

  return mapWorkflowRow(data as WorkflowRow);
}

export async function triggerWorkflowRun(
  supabase: SupabaseClient,
  workflowId: string
): Promise<WorkflowRun | null> {
  const { data: workflowExists, error: workflowError } = await supabase
    .from(WORKFLOWS_TABLE)
    .select('id')
    .eq('id', workflowId)
    .maybeSingle();

  if (workflowError) {
    throwSupabaseError(workflowError, 'Failed to load workflow before triggering run');
  }

  if (!workflowExists) {
    return null;
  }

  const { data, error } = await supabase
    .from(WORKFLOW_RUNS_TABLE)
    .insert({
      id: crypto.randomUUID(),
      workflow_id: workflowId,
      status: 'queued',
      triggered_at: nowIso(),
      started_at: null,
      completed_at: null,
      summary: 'Run queued by workflow trigger endpoint.',
    })
    .select('*')
    .single();

  if (error) {
    throwSupabaseError(error, 'Failed to trigger workflow run');
  }

  return mapWorkflowRunRow(data as WorkflowRunRow);
}

export async function listWorkflowRuns(
  supabase: SupabaseClient,
  workflowId: string,
  page: number,
  pageSize: number
): Promise<{ total: number; page: number; pageSize: number; data: readonly WorkflowRun[] } | null> {
  const { data: workflowExists, error: workflowError } = await supabase
    .from(WORKFLOWS_TABLE)
    .select('id')
    .eq('id', workflowId)
    .maybeSingle();

  if (workflowError) {
    throwSupabaseError(workflowError, 'Failed to verify workflow before listing runs');
  }

  if (!workflowExists) {
    return null;
  }

  const from = Math.max(0, (page - 1) * pageSize);
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from(WORKFLOW_RUNS_TABLE)
    .select('*', { count: 'exact' })
    .eq('workflow_id', workflowId)
    .order('triggered_at', { ascending: false })
    .range(from, to);

  if (error) {
    throwSupabaseError(error, 'Failed to list workflow runs');
  }

  return {
    total: count ?? 0,
    page,
    pageSize,
    data: (data ?? []).map((row) => mapWorkflowRunRow(row as WorkflowRunRow)),
  };
}

export async function dashboardSummaryEnvelope(supabase: SupabaseClient): Promise<{
  schemaVersion: string;
  data: DashboardSummary;
}> {
  const [
    workflowCountResult,
    activeWorkflowCountResult,
    workflowStageResult,
    runStatusResult,
    leadCountResult,
  ] = await Promise.all([
    supabase.from(WORKFLOWS_TABLE).select('id', { count: 'exact', head: true }),
    supabase
      .from(WORKFLOWS_TABLE)
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase.from(WORKFLOWS_TABLE).select('stage'),
    supabase.from(WORKFLOW_RUNS_TABLE).select('status'),
    supabase.from(LEADS_TABLE).select('id', { count: 'exact', head: true }),
  ]);

  if (workflowCountResult.error) {
    throwSupabaseError(workflowCountResult.error, 'Failed to count workflows');
  }
  if (activeWorkflowCountResult.error) {
    throwSupabaseError(activeWorkflowCountResult.error, 'Failed to count active workflows');
  }
  if (workflowStageResult.error) {
    throwSupabaseError(workflowStageResult.error, 'Failed to load workflow stages');
  }
  if (runStatusResult.error) {
    throwSupabaseError(runStatusResult.error, 'Failed to load run statuses');
  }
  if (leadCountResult.error) {
    throwSupabaseError(leadCountResult.error, 'Failed to count leads');
  }

  const statusCounts: Record<WorkflowRunStatus, number> = {
    queued: 0,
    running: 0,
    succeeded: 0,
    failed: 0,
  };

  for (const row of runStatusResult.data ?? []) {
    const status = readString((row as Record<string, unknown>)['status'], 'workflow_runs.status');
    if (
      status === 'queued' ||
      status === 'running' ||
      status === 'succeeded' ||
      status === 'failed'
    ) {
      statusCounts[status] += 1;
    }
  }

  const stageCounts = new Map<string, number>();
  for (const row of workflowStageResult.data ?? []) {
    const stage = readString((row as Record<string, unknown>)['stage'], 'workflows.stage');
    stageCounts.set(stage, (stageCounts.get(stage) ?? 0) + 1);
  }

  return {
    schemaVersion: DASHBOARD_API_SCHEMA_VERSION,
    data: {
      leadCount: leadCountResult.count ?? 0,
      workflowCount: workflowCountResult.count ?? 0,
      activeWorkflowCount: activeWorkflowCountResult.count ?? 0,
      queuedRunCount: statusCounts.queued,
      runningRunCount: statusCounts.running,
      succeededRunCount: statusCounts.succeeded,
      failedRunCount: statusCounts.failed,
      workflowsByStage: Array.from(stageCounts.entries()).map(([stage, count]) => ({
        stage,
        count,
      })),
    },
  };
}

export async function dashboardRecentRunsEnvelope(
  supabase: SupabaseClient,
  limit: number
): Promise<{
  schemaVersion: string;
  data: readonly DashboardRecentRun[];
}> {
  const { data: runs, error: runsError } = await supabase
    .from(WORKFLOW_RUNS_TABLE)
    .select('*')
    .order('triggered_at', { ascending: false })
    .limit(limit);

  if (runsError) {
    throwSupabaseError(runsError, 'Failed to load recent workflow runs');
  }

  const workflowIds = Array.from(
    new Set(
      (runs ?? []).map((row) =>
        readString((row as Record<string, unknown>)['workflow_id'], 'workflow_runs.workflow_id')
      )
    )
  );

  let workflowNameById = new Map<string, string>();
  if (workflowIds.length > 0) {
    const { data: workflows, error: workflowError } = await supabase
      .from(WORKFLOWS_TABLE)
      .select('id, name')
      .in('id', workflowIds);

    if (workflowError) {
      throwSupabaseError(workflowError, 'Failed to load workflow names for recent runs');
    }

    workflowNameById = new Map(
      (workflows ?? []).map((row) => {
        const record = row as Record<string, unknown>;
        return [
          readString(record['id'], 'workflows.id'),
          readString(record['name'], 'workflows.name'),
        ];
      })
    );
  }

  return {
    schemaVersion: DASHBOARD_API_SCHEMA_VERSION,
    data: (runs ?? []).map((row) => {
      const mappedRun = mapWorkflowRunRow(row as WorkflowRunRow);
      return {
        runId: mappedRun.id,
        workflowId: mappedRun.workflowId,
        workflowName: workflowNameById.get(mappedRun.workflowId) ?? 'Unknown workflow',
        status: mappedRun.status,
        triggeredAt: mappedRun.triggeredAt,
        completedAt: mappedRun.completedAt,
      };
    }),
  };
}

export { WORKFLOW_API_SCHEMA_VERSION as WORKFLOW_SCHEMA_VERSION } from '../../src/app/core/services/workflow-contract';
