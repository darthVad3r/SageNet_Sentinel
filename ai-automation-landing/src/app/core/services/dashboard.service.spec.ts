import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DASHBOARD_API_SCHEMA_VERSION } from './dashboard-contract';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, provideHttpClient(), provideHttpClientTesting()],
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
        workflowsByStage: [
          { stage: 'discovery', count: 2 },
          { stage: 'live', count: 1 },
        ],
      },
    });

    const result = await resultPromise;
    expect(result.leadCount).toBe(12);
    expect(result.workflowsByStage).toHaveLength(2);
    expect(result.workflowsByStage[0]).toEqual({ stage: 'discovery', count: 2 });
  });

  it('parses empty workflowsByStage gracefully', async () => {
    const service = TestBed.inject(DashboardService);
    const resultPromise = service.loadSummary();

    httpTestingController.expectOne('/api/dashboard/summary').flush({
      schemaVersion: DASHBOARD_API_SCHEMA_VERSION,
      data: {
        leadCount: 0,
        workflowCount: 0,
        activeWorkflowCount: 0,
        queuedRunCount: 0,
        runningRunCount: 0,
        succeededRunCount: 0,
        failedRunCount: 0,
        workflowsByStage: [],
      },
    });

    const result = await resultPromise;
    expect(result.workflowsByStage).toEqual([]);
  });

  it('loads and parses recent runs', async () => {
    const service = TestBed.inject(DashboardService);
    const resultPromise = service.loadRecentRuns(5);

    const request = httpTestingController.expectOne('/api/dashboard/recent-runs?limit=5');
    expect(request.request.method).toBe('GET');

    request.flush({
      schemaVersion: DASHBOARD_API_SCHEMA_VERSION,
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
    });

    const result = await resultPromise;
    expect(result).toHaveLength(2);
    expect(result[0]?.status).toBe('succeeded');
    expect(result[0]?.completedAt).toBe('2026-06-15T10:00:05.000Z');
    expect(result[1]?.status).toBe('queued');
    expect(result[1]?.completedAt).toBeNull();
  });
});
