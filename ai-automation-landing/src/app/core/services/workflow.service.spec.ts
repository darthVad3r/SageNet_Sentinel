import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { WORKFLOW_API_SCHEMA_VERSION } from './workflow-contract';
import { WorkflowService } from './workflow.service';

describe('WorkflowService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowService, provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('lists workflows from /api/workflows', async () => {
    const service = TestBed.inject(WorkflowService);
    const resultPromise = service.listWorkflows();

    const request = httpTestingController.expectOne('/api/workflows');
    expect(request.request.method).toBe('GET');

    request.flush({
      schemaVersion: WORKFLOW_API_SCHEMA_VERSION,
      data: [
        {
          id: 'workflow-1',
          name: 'Lead Qualification',
          description: 'Qualify inbound leads',
          client: 'Orbit Labs',
          stage: 'discovery',
          status: 'active',
          createdAt: '2026-06-14T01:00:00.000Z',
          updatedAt: '2026-06-14T02:00:00.000Z',
          steps: [],
          stageHistory: [],
        },
      ],
    });

    const result = await resultPromise;
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Lead Qualification');
  });

  it('creates workflow and parses envelope', async () => {
    const service = TestBed.inject(WorkflowService);
    const resultPromise = service.createWorkflow({
      name: 'Workflow A',
      description: 'Description',
      client: 'Client One',
      stage: 'discovery',
      status: 'active',
      steps: [
        {
          type: 'manual',
          description: 'Review lead',
          owner: 'ops',
        },
      ],
    });

    const request = httpTestingController.expectOne('/api/workflows');
    expect(request.request.method).toBe('POST');

    request.flush({
      schemaVersion: WORKFLOW_API_SCHEMA_VERSION,
      data: {
        id: 'workflow-2',
        name: 'Workflow A',
        description: 'Description',
        client: 'Client One',
        stage: 'discovery',
        status: 'active',
        createdAt: '2026-06-14T01:00:00.000Z',
        updatedAt: '2026-06-14T02:00:00.000Z',
        steps: [
          {
            id: 'step-1',
            order: 0,
            type: 'manual',
            description: 'Review lead',
            owner: 'ops',
          },
        ],
        stageHistory: [],
      },
    });

    const result = await resultPromise;
    expect(result.id).toBe('workflow-2');
    expect(result.steps).toHaveLength(1);
  });

  it('lists paginated run history', async () => {
    const service = TestBed.inject(WorkflowService);
    const resultPromise = service.listRuns('workflow-1', 1, 10);

    const request = httpTestingController.expectOne(
      (candidate) =>
        candidate.url === '/api/workflows/workflow-1/runs' &&
        candidate.params.get('page') === '1' &&
        candidate.params.get('pageSize') === '10'
    );
    expect(request.request.method).toBe('GET');

    request.flush({
      schemaVersion: WORKFLOW_API_SCHEMA_VERSION,
      page: 1,
      pageSize: 10,
      total: 1,
      data: [
        {
          id: 'run-1',
          workflowId: 'workflow-1',
          status: 'succeeded',
          triggeredAt: '2026-06-14T03:00:00.000Z',
          startedAt: '2026-06-14T03:00:05.000Z',
          completedAt: '2026-06-14T03:00:09.000Z',
          summary: 'Run completed successfully',
        },
      ],
    });

    const result = await resultPromise;
    expect(result.total).toBe(1);
    expect(result.data[0]?.status).toBe('succeeded');
  });
});
