import type { WorkflowRunStatus } from './workflow-contract';

export const DASHBOARD_API_SCHEMA_VERSION = '2026-06-14';

export interface DashboardWorkflowStageBreakdown {
  readonly stage: string;
  readonly count: number;
}

export interface DashboardSummary {
  readonly leadCount: number;
  readonly workflowCount: number;
  readonly activeWorkflowCount: number;
  readonly queuedRunCount: number;
  readonly runningRunCount: number;
  readonly succeededRunCount: number;
  readonly failedRunCount: number;
  readonly workflowsByStage: readonly DashboardWorkflowStageBreakdown[];
}

export interface DashboardSummaryEnvelope {
  readonly schemaVersion: string;
  readonly data: DashboardSummary;
}

export interface DashboardRecentRun {
  readonly runId: string;
  readonly workflowId: string;
  readonly workflowName: string;
  readonly status: WorkflowRunStatus;
  readonly triggeredAt: string;
  readonly completedAt: string | null;
}

export interface DashboardRecentRunsPage {
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly data: readonly DashboardRecentRun[];
}

export interface DashboardRecentRunsEnvelope {
  readonly schemaVersion: string;
  readonly data: DashboardRecentRunsPage;
}
