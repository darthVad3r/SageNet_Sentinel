import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { WorkflowService } from '../../core/services/workflow.service';
import { WorkflowBuilderComponent } from './workflow-builder.component';

describe('WorkflowBuilderComponent', () => {
  it('renders the workflow builder workspace', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [WorkflowBuilderComponent],
      providers: [
        provideRouter([]),
        {
          provide: WorkflowService,
          useValue: {
            createWorkflow: vi.fn(),
          },
        },
      ],
    }).createComponent(WorkflowBuilderComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h1')?.textContent?.trim()).toBe('Workflow Builder');
  });

  it('adds draft steps and saves a draft summary', async () => {
    const mockWorkflow = {
      id: 'workflow-123',
      name: 'Test Workflow',
      description: 'Test',
      client: 'Test Client',
      stage: 'discovery' as const,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [
        {
          id: 'step-1',
          order: 0,
          type: 'manual' as const,
          description: 'Test step',
          owner: 'Test Owner',
        },
      ],
      stageHistory: [],
    };

    const mockWorkflowService = {
      createWorkflow: vi.fn().mockResolvedValue(mockWorkflow),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [WorkflowBuilderComponent],
      providers: [
        provideRouter([]),
        {
          provide: WorkflowService,
          useValue: mockWorkflowService,
        },
      ],
    }).createComponent(WorkflowBuilderComponent);

    fixture.detectChanges();

    const component = fixture.componentInstance;
    const initialSteps = component.draft.steps.length;

    component.addStep();
    await component.saveDraft();
    fixture.detectChanges();

    expect(component.draft.steps.length).toBe(initialSteps + 1);
    expect(component.saveMessage()).toContain('Test Workflow');
    expect(component.saveMessage()).toContain('saved');
  });
});
