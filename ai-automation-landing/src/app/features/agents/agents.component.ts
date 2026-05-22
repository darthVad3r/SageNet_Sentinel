import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-agents',
  standalone: true,
  template: `
    <section class="agents surface-card" aria-label="Agents workspace">
      <p class="agents__eyebrow">Agents</p>
      <h1>Agent Operations</h1>
      <p class="agents__subtitle">
        Manage agent definitions, runtime behavior, and deployment readiness from one place.
      </p>

      <div class="agents__grid">
        <article class="surface-card surface-card--muted">
          <h2>Registry</h2>
          <p>Track active agent profiles and ownership metadata.</p>
        </article>
        <article class="surface-card surface-card--muted">
          <h2>Runtime Health</h2>
          <p>Inspect execution outcomes, retries, and trace quality.</p>
        </article>
        <article class="surface-card surface-card--muted">
          <h2>Policies</h2>
          <p>Configure safety, escalation, and rollout controls.</p>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .agents {
        display: grid;
        gap: var(--lab-space-4);
      }

      .agents__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: var(--lab-text-xs);
        font-weight: 700;
        color: var(--lab-color-primary-strong);
      }

      .agents__subtitle {
        max-width: 70ch;
      }

      .agents__grid {
        display: grid;
        gap: var(--lab-space-4);
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .agents__grid h2 {
        font-size: var(--lab-text-lg);
        margin-bottom: var(--lab-space-2);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsComponent {}
