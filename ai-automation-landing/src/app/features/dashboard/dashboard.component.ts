import { ChangeDetectionStrategy, Component } from '@angular/core';

import { KpiCardComponent } from './kpi-card.component';

interface KpiMetric {
  readonly title: string;
  readonly value: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KpiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <header class="dashboard__header">
        <h1>Dashboard</h1>
        <p>Foundational dashboard scaffold. Future stories will populate each section.</p>
      </header>

      <section class="kpi-section" aria-label="KPI placeholders">
        <h2>KPIs</h2>

        <div class="kpi-section__grid">
          @for (metric of kpiMetrics; track metric.title) {
            <app-kpi-card
              [title]="metric.title"
              [value]="metric.value"
              [icon]="metric.icon ?? ''"
            />
          }
        </div>
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

      .kpi-section__grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--lab-space-3);
      }

      @media (max-width: 860px) {
        .kpi-section__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .dashboard {
          width: min(1120px, calc(100% - (var(--lab-space-3) * 2)));
          padding-top: var(--lab-space-6);
        }

        .kpi-section__grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class DashboardComponent {
  readonly kpiMetrics: readonly KpiMetric[] = [
    {
      title: 'Workflows Run',
      value: '148',
      icon: 'WF',
    },
    {
      title: 'Active Automations',
      value: '23',
      icon: 'AU',
    },
    {
      title: 'Success Rate',
      value: '97%',
      icon: 'OK',
    },
    {
      title: 'Tasks Completed',
      value: '412',
      icon: 'TSK',
    },
  ];
}
