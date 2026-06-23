import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  DASHBOARD_API_SCHEMA_VERSION,
  type DashboardRecentRun,
  type DashboardRecentRunsEnvelope,
  type DashboardRecentRunsPage,
  type DashboardAutomationImpact,
  type DashboardSummary,
  type DashboardSummaryEnvelope,
  type DashboardWorkflowStageBreakdown,
} from './dashboard-contract';
import { resolveRuntimeApiUrl } from './runtime-config';

import { AuthService } from './auth.service';
const DASHBOARD_SUMMARY_PATH = '/api/dashboard/summary';
const DASHBOARD_RECENT_RUNS_PATH = '/api/dashboard/recent-runs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
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

  async loadSummary(): Promise<DashboardSummary> {
    const response = await firstValueFrom(
      this.http.get<DashboardSummaryEnvelope>(resolveRuntimeApiUrl(DASHBOARD_SUMMARY_PATH), {
        headers: this.getHttpHeaders(),
      })
    );

    if (response.schemaVersion !== DASHBOARD_API_SCHEMA_VERSION) {
      throw new Error('Invalid dashboard summary response envelope.');
    }

    return this.readSummary(response.data);
  }

  async loadRecentRuns(page = 1, pageSize = 10): Promise<DashboardRecentRunsPage> {
    const response = await firstValueFrom(
      this.http.get<DashboardRecentRunsEnvelope>(
        resolveRuntimeApiUrl(`${DASHBOARD_RECENT_RUNS_PATH}?page=${page}&pageSize=${pageSize}`),
        { headers: this.getHttpHeaders() }
      )
    );

    if (response.schemaVersion !== DASHBOARD_API_SCHEMA_VERSION) {
      throw new Error('Invalid dashboard recent runs response envelope.');
    }

    if (!this.isRecord(response.data)) {
      throw new TypeError('Invalid dashboard recent runs payload.');
    }

    const payload = response.data;
    const runsRaw = payload.data;
    if (!Array.isArray(runsRaw)) {
      throw new TypeError('Invalid dashboard recent runs list payload.');
    }

    return {
      total: this.readNumber(payload.total, 'total'),
      page: this.readNumber(payload.page, 'page'),
      pageSize: this.readNumber(payload.pageSize, 'pageSize'),
      data: runsRaw.map((entry) => this.readRecentRun(entry)),
    };
  }

  private readSummary(value: unknown): DashboardSummary {
    if (!this.isRecord(value)) {
      throw new Error('Invalid dashboard summary payload.');
    }

    const stagesRaw = value['workflowsByStage'];
    const workflowsByStage: DashboardWorkflowStageBreakdown[] = Array.isArray(stagesRaw)
      ? stagesRaw.map((s) => this.readStageBreakdown(s))
      : [];
    const impactRaw = value['automationImpact'];
    const automationImpact: DashboardAutomationImpact[] = Array.isArray(impactRaw)
      ? impactRaw.map((entry) => this.readAutomationImpact(entry))
      : [];

    return {
      leadCount: this.readNumber(value['leadCount'], 'leadCount'),
      workflowCount: this.readNumber(value['workflowCount'], 'workflowCount'),
      activeWorkflowCount: this.readNumber(value['activeWorkflowCount'], 'activeWorkflowCount'),
      queuedRunCount: this.readNumber(value['queuedRunCount'], 'queuedRunCount'),
      runningRunCount: this.readNumber(value['runningRunCount'], 'runningRunCount'),
      succeededRunCount: this.readNumber(value['succeededRunCount'], 'succeededRunCount'),
      failedRunCount: this.readNumber(value['failedRunCount'], 'failedRunCount'),
      totalRunCount: this.readNumber(value['totalRunCount'], 'totalRunCount'),
      totalEstimatedHoursSaved: this.readNumber(
        value['totalEstimatedHoursSaved'],
        'totalEstimatedHoursSaved'
      ),
      hasImpactData: this.readBoolean(value['hasImpactData'], 'hasImpactData'),
      automationImpact,
      workflowsByStage,
    };
  }

  private readStageBreakdown(value: unknown): DashboardWorkflowStageBreakdown {
    if (!this.isRecord(value)) {
      throw new Error('Invalid stage breakdown entry.');
    }

    return {
      stage: this.readString(value['stage'], 'stage'),
      count: this.readNumber(value['count'], 'count'),
    };
  }

  private readRecentRun(value: unknown): DashboardRecentRun {
    if (!this.isRecord(value)) {
      throw new Error('Invalid recent run entry.');
    }

    const status = this.readString(value['status'], 'status');
    if (
      status !== 'queued' &&
      status !== 'running' &&
      status !== 'succeeded' &&
      status !== 'failed'
    ) {
      throw new Error(`Invalid run status: ${status}`);
    }

    const completedAtRaw = value['completedAt'];
    return {
      runId: this.readString(value['runId'], 'runId'),
      workflowId: this.readString(value['workflowId'], 'workflowId'),
      workflowName: this.readString(value['workflowName'], 'workflowName'),
      status,
      triggeredAt: this.readString(value['triggeredAt'], 'triggeredAt'),
      completedAt:
        completedAtRaw === null || completedAtRaw === undefined
          ? null
          : this.readString(completedAtRaw, 'completedAt'),
    };
  }

  private readAutomationImpact(value: unknown): DashboardAutomationImpact {
    if (!this.isRecord(value)) {
      throw new Error('Invalid automation impact entry.');
    }

    return {
      workflowId: this.readString(value['workflowId'], 'workflowId'),
      workflowName: this.readString(value['workflowName'], 'workflowName'),
      runCount: this.readNumber(value['runCount'], 'runCount'),
      estimatedMinutesSavedPerRun: this.readNumber(
        value['estimatedMinutesSavedPerRun'],
        'estimatedMinutesSavedPerRun'
      ),
      estimatedHoursSaved: this.readNumber(value['estimatedHoursSaved'], 'estimatedHoursSaved'),
    };
  }

  private readString(value: unknown, label: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`${label} must be a non-empty string.`);
    }

    return value;
  }

  private readNumber(value: unknown, label: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`${label} must be a number.`);
    }

    return value;
  }

  private readBoolean(value: unknown, label: string): boolean {
    if (typeof value !== 'boolean') {
      throw new TypeError(`${label} must be a boolean.`);
    }

    return value;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
