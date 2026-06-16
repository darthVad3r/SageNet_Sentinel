import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './auth.service';
import { resolveRuntimeApiUrl } from './runtime-config';
import {
  WORKFLOW_API_SCHEMA_VERSION,
  type Workflow,
  type WorkflowInput,
  type WorkflowRun,
} from './workflow-contract';

const WORKFLOWS_API_PATH = '/api/workflows';

interface WorkflowEnvelope {
  readonly schemaVersion: unknown;
  readonly data: unknown;
}

interface WorkflowRunListEnvelope {
  readonly schemaVersion: unknown;
  readonly total: unknown;
  readonly page: unknown;
  readonly pageSize: unknown;
  readonly data: unknown;
}

interface WorkflowRunPage {
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly data: readonly WorkflowRun[];
}

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private readonly http = inject(HttpClient);

  private readonly authService = inject(AuthService);

  private getHttpHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = this.authService.getAccessToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  async listWorkflows(): Promise<readonly Workflow[]> {
    const response = await firstValueFrom(
      this.http.get<WorkflowEnvelope>(resolveRuntimeApiUrl(WORKFLOWS_API_PATH), {
        headers: this.getHttpHeaders(),
      })
    );
    return this.readWorkflowArrayEnvelope(response);
  }

  async createWorkflow(input: WorkflowInput): Promise<Workflow> {
    const response = await firstValueFrom(
      this.http.post<WorkflowEnvelope>(resolveRuntimeApiUrl(WORKFLOWS_API_PATH), input, {
        headers: this.getHttpHeaders(),
      })
    );
    return this.readWorkflowEnvelope(response);
  }

  async updateWorkflow(workflowId: string, input: WorkflowInput): Promise<Workflow> {
    const response = await firstValueFrom(
      this.http.put<WorkflowEnvelope>(
        resolveRuntimeApiUrl(`${WORKFLOWS_API_PATH}/${encodeURIComponent(workflowId)}`),
        input,
        { headers: this.getHttpHeaders() }
      )
    );
    return this.readWorkflowEnvelope(response);
  }

  async triggerRun(workflowId: string): Promise<WorkflowRun> {
    const response = await firstValueFrom(
      this.http.post<WorkflowEnvelope>(
        resolveRuntimeApiUrl(`${WORKFLOWS_API_PATH}/${encodeURIComponent(workflowId)}/runs`),
        {},
        { headers: this.getHttpHeaders() }
      )
    );

    if (response.schemaVersion !== WORKFLOW_API_SCHEMA_VERSION || !this.isRecord(response.data)) {
      throw new Error('Invalid workflow run response envelope.');
    }

    return this.readWorkflowRun(response.data);
  }

  async listRuns(workflowId: string, page = 1, pageSize = 10): Promise<WorkflowRunPage> {
    let params = new HttpParams();
    params = params.set('page', String(page));
    params = params.set('pageSize', String(pageSize));

    const response = await firstValueFrom(
      this.http.get<WorkflowRunListEnvelope>(
        resolveRuntimeApiUrl(`${WORKFLOWS_API_PATH}/${encodeURIComponent(workflowId)}/runs`),
        { headers: this.getHttpHeaders(), params }
      )
    );

    if (response.schemaVersion !== WORKFLOW_API_SCHEMA_VERSION || !Array.isArray(response.data)) {
      throw new Error('Invalid workflow runs response envelope.');
    }

    return {
      total: this.readNumber(response.total, 'total'),
      page: this.readNumber(response.page, 'page'),
      pageSize: this.readNumber(response.pageSize, 'pageSize'),
      data: response.data.map((entry) => this.readWorkflowRun(entry)),
    };
  }

  private readWorkflowArrayEnvelope(response: WorkflowEnvelope): readonly Workflow[] {
    if (response.schemaVersion !== WORKFLOW_API_SCHEMA_VERSION || !Array.isArray(response.data)) {
      throw new Error('Invalid workflows list response envelope.');
    }

    return response.data.map((entry) => this.readWorkflow(entry));
  }

  private readWorkflowEnvelope(response: WorkflowEnvelope): Workflow {
    if (response.schemaVersion !== WORKFLOW_API_SCHEMA_VERSION || !this.isRecord(response.data)) {
      throw new Error('Invalid workflow response envelope.');
    }

    return this.readWorkflow(response.data);
  }

  private readWorkflow(value: unknown): Workflow {
    if (
      !this.isRecord(value) ||
      !Array.isArray(value['steps']) ||
      !Array.isArray(value['stageHistory'])
    ) {
      throw new Error('Invalid workflow payload.');
    }

    return {
      id: this.readString(value['id'], 'id'),
      name: this.readString(value['name'], 'name'),
      description: this.readString(value['description'], 'description'),
      client: this.readString(value['client'], 'client'),
      stage: this.readString(value['stage'], 'stage') as Workflow['stage'],
      status: this.readString(value['status'], 'status'),
      createdAt: this.readString(value['createdAt'], 'createdAt'),
      updatedAt: this.readString(value['updatedAt'], 'updatedAt'),
      steps: value['steps'].map((entry) => this.readWorkflowStep(entry)),
      stageHistory: value['stageHistory'].map((entry) => this.readWorkflowStageChange(entry)),
    };
  }

  private readWorkflowStep(value: unknown): Workflow['steps'][number] {
    if (!this.isRecord(value)) {
      throw new Error('Invalid workflow step payload.');
    }

    return {
      id: this.readString(value['id'], 'step.id'),
      order: this.readNumber(value['order'], 'step.order'),
      type: this.readString(value['type'], 'step.type') as Workflow['steps'][number]['type'],
      description: this.readString(value['description'], 'step.description'),
      owner: this.readString(value['owner'], 'step.owner'),
    };
  }

  private readWorkflowStageChange(value: unknown): Workflow['stageHistory'][number] {
    if (!this.isRecord(value)) {
      throw new Error('Invalid workflow stage history payload.');
    }

    return {
      stage: this.readString(value['stage'], 'stageHistory.stage') as Workflow['stage'],
      changedAt: this.readString(value['changedAt'], 'stageHistory.changedAt'),
      actor: this.readString(value['actor'], 'stageHistory.actor'),
    };
  }

  private readWorkflowRun(value: unknown): WorkflowRun {
    if (!this.isRecord(value)) {
      throw new Error('Invalid workflow run payload.');
    }

    return {
      id: this.readString(value['id'], 'run.id'),
      workflowId: this.readString(value['workflowId'], 'run.workflowId'),
      status: this.readRunStatus(value['status']),
      triggeredAt: this.readString(value['triggeredAt'], 'run.triggeredAt'),
      startedAt: this.readNullableString(value['startedAt'], 'run.startedAt'),
      completedAt: this.readNullableString(value['completedAt'], 'run.completedAt'),
      summary: this.readString(value['summary'], 'run.summary'),
    };
  }

  private readRunStatus(value: unknown): WorkflowRun['status'] {
    const status = this.readString(value, 'run.status').toLowerCase();
    if (
      status === 'queued' ||
      status === 'running' ||
      status === 'succeeded' ||
      status === 'failed'
    ) {
      return status;
    }

    throw new Error(
      `run.status must be one of queued, running, succeeded, failed (received ${status}).`
    );
  }

  private readString(value: unknown, label: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`${label} must be a non-empty string.`);
    }

    return value;
  }

  private readNullableString(value: unknown, label: string): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value !== 'string') {
      throw new TypeError(`${label} must be a string or null.`);
    }

    return value;
  }

  private readNumber(value: unknown, label: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`${label} must be a number.`);
    }

    return value;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
