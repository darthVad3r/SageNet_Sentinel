import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  type Workflow,
  type WorkflowInput,
  type WorkflowRun,
  type WorkflowStage,
  type WorkflowStepInput,
  type WorkflowStepType,
} from '@core/services/workflow-contract';
import { WorkflowService } from '@core/services/workflow.service';

/**
 * Workflows Component
 * Workflows management feature page
 */
@Component({
  selector: 'app-workflows',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workflows-container">
      <h1>Workflows</h1>
      <p>Manage automation workflows, lifecycle stages, and execution history.</p>

      <div class="workflows-toolbar">
        <button class="btn btn-primary" type="button" (click)="startCreate()">
          Create Workflow
        </button>
        <input
          type="text"
          placeholder="Search workflows..."
          class="search-input"
          aria-label="Search workflows"
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          [disabled]="isLoading()"
        />
      </div>

      @if (errorMessage()) {
        <p class="status status-error">{{ errorMessage() }}</p>
      }

      @if (isLoading()) {
        <p class="status">Loading workflows...</p>
      }

      <section class="workflows-table">
        <table>
          <thead>
            <tr>
              <th scope="col">Workflow Name</th>
              <th scope="col">Client</th>
              <th scope="col">Status</th>
              <th scope="col">Stage</th>
              <th scope="col">Updated</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (workflow of filteredWorkflows(); track workflow.id) {
              <tr>
                <td>{{ workflow.name }}</td>
                <td>{{ workflow.client }}</td>
                <td>
                  <span class="badge" [class.badge-active]="workflow.status === 'active'">
                    {{ workflow.status }}
                  </span>
                </td>
                <td>{{ workflow.stage }}</td>
                <td>{{ formatDateTime(workflow.updatedAt) }}</td>
                <td class="actions-cell">
                  <button
                    class="btn btn-primary btn-sm"
                    type="button"
                    (click)="editWorkflow(workflow)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-secondary btn-sm"
                    type="button"
                    (click)="triggerRun(workflow)"
                  >
                    Trigger Run
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6">No workflows found.</td>
              </tr>
            }
          </tbody>
        </table>
      </section>

      @if (activeWorkflow()) {
        <section class="detail-panel">
          <h2>{{ isEditingExisting() ? 'Edit Workflow' : 'Create Workflow' }}</h2>

          <label>
            Name
            <input [(ngModel)]="editor.name" class="search-input" />
          </label>

          <label>
            Client
            <input [(ngModel)]="editor.client" class="search-input" />
          </label>

          <label>
            Description
            <textarea [(ngModel)]="editor.description" class="search-input" rows="4"></textarea>
          </label>

          <div class="row-grid">
            <label>
              Stage
              <select [(ngModel)]="editor.stage" class="search-input">
                @for (stage of stages; track stage) {
                  <option [value]="stage">{{ stage }}</option>
                }
              </select>
            </label>

            <label>
              Status
              <select [(ngModel)]="editor.status" class="search-input">
                <option value="active">active</option>
                <option value="paused">paused</option>
              </select>
            </label>
          </div>

          <div class="steps-header">
            <h3>Steps</h3>
            <button class="btn btn-secondary btn-sm" type="button" (click)="addStep()">
              Add Step
            </button>
          </div>

          @for (step of editor.steps; track $index) {
            <div class="step-row">
              <select [(ngModel)]="step.type" class="search-input step-type">
                <option value="manual">manual</option>
                <option value="automated">automated</option>
                <option value="integration">integration</option>
              </select>
              <input [(ngModel)]="step.owner" class="search-input" placeholder="owner" />
              <input
                [(ngModel)]="step.description"
                class="search-input"
                placeholder="description"
              />
              <button class="btn btn-secondary btn-sm" type="button" (click)="moveStepUp($index)">
                Up
              </button>
              <button class="btn btn-secondary btn-sm" type="button" (click)="moveStepDown($index)">
                Down
              </button>
              <button class="btn btn-danger btn-sm" type="button" (click)="removeStep($index)">
                Remove
              </button>
            </div>
          }

          <div class="editor-actions">
            <button class="btn btn-primary" type="button" (click)="saveWorkflow()">Save</button>
            <button class="btn btn-secondary" type="button" (click)="cancelEditing()">
              Cancel
            </button>
          </div>
        </section>
      }

      @if (selectedRuns().length > 0) {
        <section class="run-history">
          <h2>Run History</h2>
          @if (isPollingRuns()) {
            <p class="status">Live run updates enabled while runs are queued/running.</p>
          }
          <table>
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Triggered</th>
                <th scope="col">Started</th>
                <th scope="col">Completed</th>
                <th scope="col">Summary</th>
              </tr>
            </thead>
            <tbody>
              @for (run of selectedRuns(); track run.id) {
                <tr>
                  <td>
                    <span class="badge" [ngClass]="runStatusClass(run.status)">
                      {{ run.status }}
                    </span>
                  </td>
                  <td>{{ formatDateTime(run.triggeredAt) }}</td>
                  <td>{{ formatDateTime(run.startedAt) }}</td>
                  <td>{{ formatDateTime(run.completedAt) }}</td>
                  <td>{{ run.summary }}</td>
                </tr>
              }
            </tbody>
          </table>
        </section>
      }
    </div>
  `,
  styles: [
    `
      .workflows-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        margin-bottom: 1rem;
        font-size: 2rem;
      }

      p {
        color: var(--lab-ink-soft);
        margin-bottom: 2rem;
      }

      .workflows-toolbar {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .search-input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--lab-line);
        border-radius: 4px;
        font-size: 1rem;
      }

      .workflows-table {
        overflow-x: auto;
      }

      .status {
        margin: 0 0 1rem;
        color: var(--lab-ink-soft);
      }

      .status-error {
        color: var(--lab-color-danger, #b42318);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: var(--lab-surface);
        border: 1px solid var(--lab-line);
        border-radius: 4px;
        overflow: hidden;
      }

      thead {
        background: var(--lab-surface);
        border-bottom: 2px solid var(--lab-line);
      }

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid var(--lab-line);
      }

      .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .badge-active {
        background: color-mix(in srgb, var(--lab-color-primary) 16%, var(--lab-surface));
        color: var(--lab-color-primary-strong);
      }

      .badge-inactive {
        background: color-mix(in srgb, var(--lab-ink-soft) 18%, var(--lab-surface));
        color: var(--lab-ink);
      }

      .badge-queued {
        background: color-mix(in srgb, #f59e0b 18%, var(--lab-surface));
        color: #b45309;
      }

      .badge-running {
        background: color-mix(in srgb, #0891b2 18%, var(--lab-surface));
        color: #0e7490;
      }

      .badge-succeeded {
        background: color-mix(in srgb, #22c55e 18%, var(--lab-surface));
        color: #15803d;
      }

      .badge-failed {
        background: color-mix(in srgb, #ef4444 18%, var(--lab-surface));
        color: #b91c1c;
      }

      .actions-cell {
        display: flex;
        gap: 0.5rem;
      }

      .detail-panel,
      .run-history {
        margin-top: 2rem;
        padding: 1rem;
        border: 1px solid var(--lab-line);
        border-radius: 6px;
      }

      .detail-panel h2,
      .run-history h2 {
        margin-top: 0;
      }

      label {
        display: block;
        margin-bottom: 0.75rem;
      }

      .row-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .steps-header {
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .step-row {
        display: grid;
        grid-template-columns: 140px 180px 1fr auto auto auto;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .step-type {
        width: 140px;
      }

      .editor-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.75rem;
      }

      .btn-danger {
        background: color-mix(in srgb, var(--lab-color-primary, #1f6feb) 12%, #b42318);
        color: #ffffff;
      }
    `,
  ],
})
export class WorkflowsComponent implements OnInit, OnDestroy {
  private readonly workflowService = inject(WorkflowService);

  private runPollTimer: ReturnType<typeof setTimeout> | null = null;

  readonly workflows = signal<readonly Workflow[]>([]);

  readonly isLoading = signal(true);

  readonly errorMessage = signal<string | null>(null);

  readonly selectedRuns = signal<readonly WorkflowRun[]>([]);

  readonly activeWorkflow = signal<Workflow | null>(null);

  readonly isEditingExisting = signal(false);

  readonly stages: readonly WorkflowStage[] = [
    'discovery',
    'implementation',
    'testing',
    'live',
    'paused',
  ];

  readonly searchTerm = signal('');

  readonly runHistoryWorkflowId = signal<string | null>(null);

  readonly isPollingRuns = signal(false);

  editor: {
    id: string | null;
    name: string;
    description: string;
    client: string;
    stage: WorkflowStage;
    status: string;
    steps: Array<{ type: WorkflowStepType; description: string; owner: string }>;
  } = this.createBlankEditor();

  readonly filteredWorkflows = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.workflows();
    }

    return this.workflows().filter((workflow) => {
      const haystack = `${workflow.name} ${workflow.client} ${workflow.stage}`.toLowerCase();
      return haystack.includes(term);
    });
  });

  ngOnInit(): void {
    void this.loadWorkflows();
  }

  ngOnDestroy(): void {
    this.stopRunPolling();
  }

  async loadWorkflows(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.workflows.set(await this.workflowService.listWorkflows());
    } catch {
      this.errorMessage.set('Unable to load workflows from the API.');
    } finally {
      this.isLoading.set(false);
    }
  }

  startCreate(): void {
    this.activeWorkflow.set({
      id: 'new',
      name: '',
      description: '',
      client: '',
      stage: 'discovery',
      status: 'active',
      createdAt: '',
      updatedAt: '',
      steps: [],
      stageHistory: [],
    });
    this.isEditingExisting.set(false);
    this.editor = this.createBlankEditor();
  }

  editWorkflow(workflow: Workflow): void {
    this.activeWorkflow.set(workflow);
    this.isEditingExisting.set(true);
    this.editor = {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      client: workflow.client,
      stage: workflow.stage,
      status: workflow.status,
      steps: workflow.steps.map((step) => ({
        type: step.type,
        description: step.description,
        owner: step.owner,
      })),
    };

    this.runHistoryWorkflowId.set(workflow.id);
    void this.loadRuns(workflow.id);
  }

  cancelEditing(): void {
    this.activeWorkflow.set(null);
    this.isEditingExisting.set(false);
    this.editor = this.createBlankEditor();
  }

  addStep(): void {
    this.editor.steps.push({
      type: 'manual',
      description: '',
      owner: '',
    });
  }

  removeStep(index: number): void {
    this.editor.steps.splice(index, 1);
  }

  moveStepUp(index: number): void {
    if (index <= 0) {
      return;
    }

    const previous = this.editor.steps[index - 1];
    this.editor.steps[index - 1] = this.editor.steps[index]!;
    this.editor.steps[index] = previous!;
  }

  moveStepDown(index: number): void {
    if (index >= this.editor.steps.length - 1) {
      return;
    }

    const next = this.editor.steps[index + 1];
    this.editor.steps[index + 1] = this.editor.steps[index]!;
    this.editor.steps[index] = next!;
  }

  async saveWorkflow(): Promise<void> {
    const payload: WorkflowInput = {
      name: this.editor.name,
      description: this.editor.description,
      client: this.editor.client,
      stage: this.editor.stage,
      status: this.editor.status,
      steps: this.editor.steps.map(
        (step): WorkflowStepInput => ({
          type: step.type,
          description: step.description,
          owner: step.owner,
        })
      ),
    };

    try {
      if (this.isEditingExisting() && this.editor.id) {
        await this.workflowService.updateWorkflow(this.editor.id, payload);
      } else {
        await this.workflowService.createWorkflow(payload);
      }

      await this.loadWorkflows();
      this.cancelEditing();
    } catch {
      this.errorMessage.set('Unable to save workflow. Check lifecycle transition and step fields.');
    }
  }

  async triggerRun(workflow: Workflow): Promise<void> {
    try {
      this.errorMessage.set(null);
      await this.workflowService.triggerRun(workflow.id);
      await this.loadRuns(workflow.id);
      await this.loadWorkflows();
      this.startRunPolling(workflow.id);
    } catch {
      this.errorMessage.set('Unable to trigger workflow run.');
    }
  }

  async loadRuns(workflowId: string): Promise<void> {
    try {
      const result = await this.workflowService.listRuns(workflowId, 1, 10);
      this.selectedRuns.set(result.data);
      this.runHistoryWorkflowId.set(workflowId);
      this.syncRunPolling(workflowId, result.data);
    } catch {
      this.selectedRuns.set([]);
      this.stopRunPolling();
    }
  }

  runStatusClass(status: string): string {
    switch (status) {
      case 'queued':
        return 'badge-queued';
      case 'running':
        return 'badge-running';
      case 'succeeded':
        return 'badge-succeeded';
      case 'failed':
        return 'badge-failed';
      default:
        return 'badge-inactive';
    }
  }

  formatDateTime(value: string | null): string {
    if (!value) {
      return 'N/A';
    }

    return new Date(value).toLocaleString();
  }

  private createBlankEditor(): {
    id: string | null;
    name: string;
    description: string;
    client: string;
    stage: WorkflowStage;
    status: string;
    steps: Array<{ type: WorkflowStepType; description: string; owner: string }>;
  } {
    return {
      id: null,
      name: '',
      description: '',
      client: '',
      stage: 'discovery',
      status: 'active',
      steps: [],
    };
  }

  private syncRunPolling(workflowId: string, runs: readonly WorkflowRun[]): void {
    const hasActiveRun = runs.some((run) => run.status === 'queued' || run.status === 'running');
    if (hasActiveRun) {
      this.startRunPolling(workflowId);
      return;
    }

    this.stopRunPolling();
  }

  private startRunPolling(workflowId: string): void {
    this.runHistoryWorkflowId.set(workflowId);
    this.isPollingRuns.set(true);

    if (this.runPollTimer !== null) {
      return;
    }

    this.runPollTimer = setTimeout(() => {
      this.runPollTimer = null;
      void this.pollRuns();
    }, 2000);
  }

  private stopRunPolling(): void {
    if (this.runPollTimer !== null) {
      clearTimeout(this.runPollTimer);
      this.runPollTimer = null;
    }

    this.isPollingRuns.set(false);
  }

  private async pollRuns(): Promise<void> {
    const workflowId = this.runHistoryWorkflowId();
    if (!workflowId) {
      this.stopRunPolling();
      return;
    }

    try {
      const result = await this.workflowService.listRuns(workflowId, 1, 10);
      this.selectedRuns.set(result.data);
      this.syncRunPolling(workflowId, result.data);
    } catch {
      this.stopRunPolling();
    }
  }
}
