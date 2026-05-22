import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <header class="dashboard__header">
        <h1>Dashboard</h1>
        <p>Foundational dashboard scaffold. Future stories will populate each section.</p>
      </header>

      <section class="kpi-section" aria-label="KPI placeholders">
        <h2>KPIs</h2>
      </section>

      <section class="progress-section" aria-label="Progress placeholders">
        <h2>Progress</h2>
      </section>

      <section class="quick-actions-section" aria-label="Quick actions placeholders">
        <h2>Quick Actions</h2>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dashboard {
        width: min(1120px, calc(100% - (var(--lab-space-4) * 2)));
        margin-inline: auto;
        padding: var(--lab-space-8) 0 var(--lab-space-10);
        display: grid;
        gap: var(--lab-space-6);
        overflow-x: clip;
      }

      .dashboard__header {
        display: grid;
        gap: var(--lab-space-3);
        min-width: 0;
        padding-bottom: var(--lab-space-2);
      }

      .dashboard__header h1 {
        font-size: var(--lab-text-3xl);
      }

      .kpi-section,
      .progress-section,
      .quick-actions-section {
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-lg);
        background: var(--lab-surface);
        box-shadow: var(--lab-shadow-1);
        padding: var(--lab-space-6);
        display: grid;
        gap: var(--lab-space-2);
      }

      .kpi-section h2,
      .progress-section h2,
      .quick-actions-section h2 {
        margin: 0;
        font-size: var(--lab-text-xl);
      }

      @media (max-width: 640px) {
        .dashboard {
          width: min(1120px, calc(100% - (var(--lab-space-3) * 2)));
          padding-top: var(--lab-space-6);
        }
      }
    `,
  ],
})
export class DashboardComponent {}
