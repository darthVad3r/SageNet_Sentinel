import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-automation-editor',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="automation-editor surface-card" aria-label="Automation editor workspace">
      <p class="automation-editor__eyebrow">Automation Editor</p>
      <h1>Automation Editor</h1>
      <p class="automation-editor__subtitle">
        Shape triggers, steps, and release checks before workflow logic becomes a live system.
      </p>

      <div class="automation-editor__layout">
        <article class="automation-editor__panel surface-card surface-card--muted">
          <h2>Trigger Sources</h2>
          <p>Define where scenarios start and what inputs they expect.</p>
          <ul>
            <li>Booking intake form submission</li>
            <li>Workflow state transition</li>
            <li>Manual operator override</li>
          </ul>
        </article>

        <article class="automation-editor__panel surface-card surface-card--muted">
          <h2>Scenario Builder</h2>
          <p>Arrange the first pass of the automation flow.</p>
          <ol>
            <li>Validate payload and routing metadata.</li>
            <li>Map the trigger to a workflow action.</li>
            <li>Review the fallback and retry path.</li>
          </ol>
        </article>

        <article class="automation-editor__panel surface-card surface-card--muted">
          <h2>Release Checklist</h2>
          <p>Keep the editor aligned with the board before promoting changes.</p>
          <ul>
            <li>Guarded route exists</li>
            <li>Shortcut navigation lands here</li>
            <li>Progress board reflects active work</li>
          </ul>
        </article>
      </div>

      <div class="automation-editor__actions">
        <a
          routerLink="/workflows"
          class="automation-editor__button automation-editor__button--ghost"
        >
          Back to Workflows
        </a>
        <a
          routerLink="/settings"
          class="automation-editor__button automation-editor__button--primary"
        >
          Open Settings
        </a>
      </div>
    </section>
  `,
  styles: [
    `
      .automation-editor {
        display: grid;
        gap: var(--lab-space-4);
      }

      .automation-editor__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: var(--lab-text-xs);
        font-weight: 700;
        color: var(--lab-color-primary-strong);
      }

      .automation-editor__subtitle {
        max-width: 70ch;
      }

      .automation-editor__layout {
        display: grid;
        gap: var(--lab-space-4);
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .automation-editor__panel {
        display: grid;
        gap: var(--lab-space-2);
        align-content: start;
      }

      .automation-editor__panel h2 {
        margin: 0;
        font-size: var(--lab-text-lg);
      }

      .automation-editor__panel p,
      .automation-editor__panel ul,
      .automation-editor__panel ol {
        margin: 0;
      }

      .automation-editor__panel ul,
      .automation-editor__panel ol {
        padding-left: 1.15rem;
        display: grid;
        gap: 0.35rem;
      }

      .automation-editor__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lab-space-3);
      }

      .automation-editor__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.75rem;
        padding: 0.65rem 1rem;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 700;
        border: 1px solid transparent;
      }

      .automation-editor__button--ghost {
        border-color: var(--lab-line);
        background: var(--lab-surface);
        color: var(--lab-ink);
      }

      .automation-editor__button--primary {
        background: linear-gradient(135deg, var(--lab-color-primary), var(--lab-color-accent-cyan));
        color: var(--lab-on-primary);
      }

      @media (max-width: 1024px) {
        .automation-editor__layout {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AutomationEditorComponent {}
