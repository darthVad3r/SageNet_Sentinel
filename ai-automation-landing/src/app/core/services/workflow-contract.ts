export const WORKFLOW_API_SCHEMA_VERSION = '2026-06-14';

export type WorkflowStage = 'discovery' | 'implementation' | 'testing' | 'live' | 'paused';

export type WorkflowStepType = 'manual' | 'automated' | 'integration';

export interface WorkflowStep {
  readonly id: string;
  readonly order: number;
  readonly type: WorkflowStepType;
  readonly description: string;
  readonly owner: string;
}

export interface WorkflowStageChange {
  readonly stage: WorkflowStage;
  readonly changedAt: string;
  readonly actor: string;
}

export interface Workflow {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly client: string;
  readonly stage: WorkflowStage;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly steps: readonly WorkflowStep[];
  readonly stageHistory: readonly WorkflowStageChange[];
}

export interface WorkflowStepInput {
  readonly type: WorkflowStepType;
  readonly description: string;
  readonly owner: string;
}

export interface WorkflowInput {
  readonly name: string;
  readonly description: string;
  readonly client: string;
  readonly stage: WorkflowStage;
  readonly status: string;
  readonly steps: readonly WorkflowStepInput[];
}

export type WorkflowRunStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface WorkflowRun {
  readonly id: string;
  readonly workflowId: string;
  readonly status: WorkflowRunStatus;
  readonly triggeredAt: string;
  readonly startedAt: string | null;
  readonly completedAt: string | null;
  readonly summary: string;
}
