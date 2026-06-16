import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import type { WorkflowStepInput } from '../../core/services/workflow-contract';
import { WorkflowService } from '../../core/services/workflow.service';

type BuilderStepType = 'manual' | 'automated' | 'integration';

interface BuilderStep {
  type: BuilderStepType;
  owner: string;
  description: string;
}

@Component({
  selector: 'app-workflow-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="workflow-builder surface-card" aria-label="Workflow builder workspace">
      <p class="workflow-builder__eyebrow">Workflow Builder</p>
      <h1>Workflow Builder</h1>
      <p class="workflow-builder__subtitle">
        Draft a workflow before it reaches the live management surface. Use this space to define the
        step sequence, ownership, and release notes for the next delivery pass.
      </p>

      <div class="workflow-builder__layout">
        <section class="workflow-builder__panel surface-card surface-card--muted">
          <header class="workflow-builder__panel-header">
            <h2>Draft Details</h2>
            <span class="workflow-builder__status">{{ draftStatusLabel() }}</span>
          </header>

          <label>
            Workflow Name
            <input [(ngModel)]="draft.name" class="workflow-builder__input" />
          </label>

          <label>
            Client
            <input [(ngModel)]="draft.client" class="workflow-builder__input" />
          </label>

          <label>
            Stage
            <select [(ngModel)]="draft.stage" class="workflow-builder__input">
              <option value="discovery">discovery</option>
              <option value="implementation">implementation</option>
              <option value="testing">testing</option>
              <option value="live">live</option>
              <option value="paused">paused</option>
            </select>
          </label>

          <label>
            Description
            <textarea
              [(ngModel)]="draft.description"
              class="workflow-builder__input"
              rows="4"
            ></textarea>
          </label>
        </section>

        <section class="workflow-builder__panel surface-card surface-card--muted">
          <header class="workflow-builder__panel-header">
            <h2>Workflow Steps</h2>
            <button type="button" class="workflow-builder__button" (click)="addStep()">
              Add Step
            </button>
          </header>

          @for (step of draft.steps; track $index) {
            <div class="workflow-builder__step-row">
              <select
                [(ngModel)]="step.type"
                class="workflow-builder__input workflow-builder__step-type"
              >
                <option value="manual">manual</option>
                <option value="automated">automated</option>
                <option value="integration">integration</option>
              </select>
              <input [(ngModel)]="step.owner" class="workflow-builder__input" placeholder="owner" />
              <input
                [(ngModel)]="step.description"
                class="workflow-builder__input workflow-builder__step-description"
                placeholder="step description"
              />
              <button
                type="button"
                class="workflow-builder__icon-button"
                (click)="moveStepUp($index)"
              >
                Up
              </button>
              <button
                type="button"
                class="workflow-builder__icon-button"
                (click)="moveStepDown($index)"
              >
                Down
              </button>
              <button
                type="button"
                class="workflow-builder__icon-button workflow-builder__icon-button--danger"
                (click)="removeStep($index)"
              >
                Remove
              </button>
            </div>
          }

          @if (draft.steps.length === 0) {
            <p class="workflow-builder__empty">
              No steps yet. Add the first handoff or automation task.
            </p>
          }
        </section>

        <aside class="workflow-builder__panel surface-card surface-card--muted">
          <h2>Builder Checklist</h2>
          <ul class="workflow-builder__checklist">
            <li>Define the workflow name and client.</li>
            <li>Order the steps from intake to delivery.</li>
            <li>Assign an owner to each handoff.</li>
            <li>Use the management page once the draft is ready.</li>
          </ul>

          <div class="workflow-builder__summary">
            <h3>Draft Summary</h3>
            <p>
              {{ draft.steps.length }} step{{ draft.steps.length === 1 ? '' : 's' }} prepared for
              <strong>{{ draft.name || 'new workflow' }}</strong
              >.
            </p>
          </div>
        </aside>
      </div>

      <div class="workflow-builder__actions">
        <button
          type="button"
          class="workflow-builder__button workflow-builder__button--primary"
          (click)="saveDraft()"
          [disabled]="isLoading()"
        >
          {{ isLoading() ? 'Saving...' : 'Save Draft' }}
        </button>
        <a routerLink="/workflows" class="workflow-builder__button workflow-builder__button--ghost">
          Back to Workflows
        </a>
      </div>

      @if (errorMessage()) {
        <p class="workflow-builder__message workflow-builder__message--error" role="alert">
          ✗ {{ errorMessage() }}
        </p>
      }

      @if (saveMessage()) {
        <p class="workflow-builder__message" role="status">{{ saveMessage() }}</p>
      }
    </section>
  `,
  styles: [
    `
      .workflow-builder {
        display: grid;
        gap: var(--lab-space-4);
      }

      .workflow-builder__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: var(--lab-text-xs);
        font-weight: 700;
        color: var(--lab-color-primary-strong);
      }

      .workflow-builder__subtitle {
        max-width: 72ch;
      }

      .workflow-builder__layout {
        display: grid;
        grid-template-columns: 1.1fr 1.4fr 0.9fr;
        gap: var(--lab-space-4);
        align-items: start;
      }

      .workflow-builder__panel {
        display: grid;
        gap: var(--lab-space-3);
        align-content: start;
      }

      .workflow-builder__panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lab-space-2);
      }

      .workflow-builder__panel h2,
      .workflow-builder__summary h3 {
        margin: 0;
      }

      .workflow-builder__status {
        padding: 0.3rem 0.6rem;
        border-radius: 999px;
        background: color-mix(in srgb, var(--lab-color-primary) 12%, var(--lab-surface));
        color: var(--lab-color-primary-strong);
        font-size: var(--lab-text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .workflow-builder__input {
        width: 100%;
        margin-top: var(--lab-space-2);
        padding: 0.75rem 0.9rem;
        border: 1px solid var(--lab-line);
        border-radius: 0.75rem;
        background: var(--lab-surface);
        font: inherit;
      }

      .workflow-builder__step-row {
        display: grid;
        grid-template-columns: 140px 150px minmax(0, 1fr) auto auto auto;
        gap: var(--lab-space-2);
        align-items: center;
      }

      .workflow-builder__step-type {
        width: 100%;
      }

      .workflow-builder__step-description {
        min-width: 0;
      }

      .workflow-builder__button,
      .workflow-builder__icon-button {
        border: 1px solid var(--lab-line);
        border-radius: 999px;
        padding: 0.7rem 1rem;
        text-decoration: none;
        background: var(--lab-surface);
        color: var(--lab-ink);
        font-weight: 700;
        cursor: pointer;
      }

      .workflow-builder__button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .workflow-builder__button--primary {
        border-color: transparent;
        background: linear-gradient(135deg, var(--lab-color-primary), var(--lab-color-accent-cyan));
        color: var(--lab-on-primary);
      }

      .workflow-builder__button--ghost {
        background: transparent;
      }

      .workflow-builder__icon-button--danger {
        color: var(--lab-danger);
      }

      .workflow-builder__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lab-space-3);
      }

      .workflow-builder__checklist,
      .workflow-builder__empty,
      .workflow-builder__message,
      .workflow-builder__summary p {
        margin: 0;
      }

      .workflow-builder__checklist {
        display: grid;
        gap: var(--lab-space-2);
        padding-left: 1.2rem;
      }

      .workflow-builder__summary {
        display: grid;
        gap: var(--lab-space-2);
        padding-top: var(--lab-space-2);
        border-top: 1px solid var(--lab-line);
      }

      .workflow-builder__message {
        color: var(--lab-color-primary-strong);
        font-weight: 600;
      }

      .workflow-builder__message--error {
        color: var(--lab-danger);
      }

      @media (max-width: 1280px) {
        .workflow-builder__layout {
          grid-template-columns: 1fr;
        }

        .workflow-builder__step-row {
          grid-template-columns: 1fr 1fr;
        }

        .workflow-builder__step-description {
          grid-column: 1 / -1;
        }
      }

      @media (max-width: 768px) {
        .workflow-builder__panel-header,
        .workflow-builder__actions {
          flex-direction: column;
          align-items: stretch;
        }

        .workflow-builder__step-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class WorkflowBuilderComponent {
  private readonly workflowService = inject(WorkflowService);

  readonly isLoading = signal(false);

  readonly errorMessage = signal<string | null>(null);

  readonly draft = {
    name: 'New Workflow',
    client: '',
    stage: 'discovery' as const,
    description: '',
    steps: [
      {
        type: 'manual' as const,
        owner: 'Operations',
        description: 'Capture the incoming request and route it to the intake queue.',
      },
      {
        type: 'automated' as const,
        owner: 'Automation',
        description: 'Validate the payload and fan out the first action set.',
      },
    ] satisfies BuilderStep[],
  };

  private saveMessageValue = '';

  saveMessage(): string {
    return this.saveMessageValue;
  }

  draftStatusLabel(): string {
    return `${this.draft.stage} draft`;
  }

  addStep(): void {
    this.draft.steps = [
      ...this.draft.steps,
      {
        type: 'manual',
        owner: '',
        description: '',
      },
    ];
  }

  removeStep(index: number): void {
    this.draft.steps = this.draft.steps.filter((_, currentIndex) => currentIndex !== index);
  }

  moveStepUp(index: number): void {
    if (index <= 0) {
      return;
    }

    const steps = [...this.draft.steps];
    [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
    this.draft.steps = steps;
  }

  moveStepDown(index: number): void {
    if (index >= this.draft.steps.length - 1) {
      return;
    }

    const steps = [...this.draft.steps];
    [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
    this.draft.steps = steps;
  }

  async saveDraft(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.saveMessageValue = '';

    try {
      const workflowInput = {
        name: this.draft.name,
        description: this.draft.description,
        client: this.draft.client,
        stage: this.draft.stage,
        status: 'draft',
        steps: this.draft.steps.map((step) => ({
          type: step.type,
          description: step.description,
          owner: step.owner,
        })) satisfies WorkflowStepInput[],
      };

      const workflow = await this.workflowService.createWorkflow(workflowInput);
      const stepCount = workflow.steps.length;
      this.saveMessageValue = `✓ ${workflow.name} saved with ${stepCount} step${stepCount === 1 ? '' : 's'}. ID: ${workflow.id.substring(0, 8)}`;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save workflow';
      this.errorMessage.set(errorMsg);
      this.saveMessageValue = '';
      console.error('Workflow save failed:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
