import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DASHBOARD_API_SCHEMA_VERSION } from './dashboard-contract';
import { DashboardService } from './dashboard.service';

import { AuthService } from './auth.service';
describe('DashboardService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            getAccessToken: () => 'test-token',
          },
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads and parses the dashboard summary envelope', async () => {
    const service = TestBed.inject(DashboardService);
    const resultPromise = service.loadSummary();

    const request = httpTestingController.expectOne('/api/dashboard/summary');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');

    request.flush({
      schemaVersion: DASHBOARD_API_SCHEMA_VERSION,
      data: {
        leadCount: 12,
        workflowCount: 4,
        activeWorkflowCount: 3,
        queuedRunCount: 1,
        runningRunCount: 2,
        succeededRunCount: 8,
        failedRunCount: 1,
        totalRunCount: 12,
        totalEstimatedHoursSaved: 4.5,
        hasImpactData: true,
        automationImpact: [
          {
            workflowId: 'wf-1',
            workflowName: 'Lead Qualification',
            runCount: 9,
            estimatedMinutesSavedPerRun: 30,
            estimatedHoursSaved: 4.5,
          },
        ],
        workflowsByStage: [
          { stage: 'discovery', count: 2 },
          { stage: 'live', count: 1 },
        ],
      },
    });

    const result = await resultPromise;
    expect(result.leadCount).toBe(12);
    expect(result.totalEstimatedHoursSaved).toBe(4.5);
    expect(result.hasImpactData).toBe(true);
    expect(result.automationImpact[0]?.workflowName).toBe('Lead Qualification');
    expect(result.workflowsByStage).toHaveLength(2);
    expect(result.workflowsByStage[0]).toEqual({ stage: 'discovery', count: 2 });
  });

  it('parses empty workflowsByStage gracefully', async () => {
    const service = TestBed.inject(DashboardService);
    const resultPromise = service.loadSummary();

    const request = httpTestingController.expectOne('/api/dashboard/summary');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');

    request.flush({
      schemaVersion: DASHBOARD_API_SCHEMA_VERSION,
      data: {
        leadCount: 0,
        workflowCount: 0,
        activeWorkflowCount: 0,
        queuedRunCount: 0,
        runningRunCount: 0,
        succeededRunCount: 0,
        failedRunCount: 0,
        totalRunCount: 0,
        totalEstimatedHoursSaved: 0,
        hasImpactData: false,
        automationImpact: [],
        workflowsByStage: [],
      },
    });

    const result = await resultPromise;
    expect(result.workflowsByStage).toEqual([]);
    expect(result.automationImpact).toEqual([]);
    expect(result.hasImpactData).toBe(false);
  });

  it('loads and parses recent runs', async () => {
    const service = TestBed.inject(DashboardService);
    const resultPromise = service.loadRecentRuns(2, 5);

    const request = httpTestingController.expectOne('/api/dashboard/recent-runs?page=2&pageSize=5');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');

    request.flush({
      schemaVersion: DASHBOARD_API_SCHEMA_VERSION,
      data: {
        total: 12,
        page: 2,
        pageSize: 5,
        data: [
          {
            runId: 'run-1',
            workflowId: 'wf-1',
            workflowName: 'Lead Qualification',
            status: 'succeeded',
            triggeredAt: '2026-06-15T10:00:00.000Z',
            completedAt: '2026-06-15T10:00:05.000Z',
          },
          {
            runId: 'run-2',
            workflowId: 'wf-1',
            workflowName: 'Lead Qualification',
            status: 'queued',
            triggeredAt: '2026-06-15T10:05:00.000Z',
            completedAt: null,
          },
        ],
      },
    });

    const result = await resultPromise;
    expect(result.total).toBe(12);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(5);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]?.status).toBe('succeeded');
    expect(result.data[0]?.completedAt).toBe('2026-06-15T10:00:05.000Z');
    expect(result.data[1]?.status).toBe('queued');
    expect(result.data[1]?.completedAt).toBeNull();
  });
});
