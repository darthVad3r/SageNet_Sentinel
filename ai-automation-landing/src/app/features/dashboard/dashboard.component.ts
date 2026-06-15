import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import type { DashboardRecentRun, DashboardSummary } from '@core/services/dashboard-contract';
import { DashboardService } from '@core/services/dashboard.service';
import { QuickActionShortcutsComponent } from '../../dashboard/components/quick-action-shortcuts/quick-action-shortcuts.component';

import { KpiCardComponent } from './kpi-card.component';
import { ProgressSectionComponent } from './progress-section.component';

interface KpiMetric {
  readonly title: string;
  readonly value: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KpiCardComponent, ProgressSectionComponent, QuickActionShortcutsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <header class="dashboard__header">
        <h1>Dashboard</h1>
        <p>Foundational dashboard scaffold. Future stories will populate each section.</p>

        @if (isLoading()) {
          <p class="dashboard__status">Loading live summary data...</p>
        }

        @if (loadError(); as errorMessage) {
          <p class="dashboard__error" role="alert">{{ errorMessage }}</p>
        }
      </header>

      <section class="kpi-section" aria-label="Key performance indicators">
        <h2>KPIs</h2>

        <div class="kpi-section__grid">
          @for (metric of kpiMetrics(); track metric.title) {
            <app-kpi-card
              [title]="metric.title"
              [value]="metric.value"
              [icon]="metric.icon ?? ''"
            />
          }
        </div>
      </section>

      <app-quick-action-shortcuts />

      @if (workflowsByStage().length > 0) {
        <section class="stages-section surface-card" aria-label="Workflow stage breakdown">
          <header class="stages-section__header">
            <h2>Workflows by Stage</h2>
            <p>Current distribution of active workflows across delivery stages.</p>
          </header>

          <ul class="stages-section__grid" aria-label="Stage counts">
            @for (item of workflowsByStage(); track item.stage) {
              <li class="stages-section__item">
                <span class="stages-section__stage">{{ item.stage }}</span>
                <span class="stages-section__count">{{ item.count }}</span>
              </li>
            }
          </ul>
        </section>
      }

      @if (recentRuns().length > 0) {
        <section class="activity-section surface-card" aria-label="Recent run activity">
          <header class="activity-section__header">
            <h2>Recent Activity</h2>
            <p>Last {{ recentRuns().length }} workflow runs across all automations.</p>
          </header>

          <ul class="activity-section__list" aria-label="Recent workflow runs">
            @for (run of recentRuns(); track run.runId) {
              <li class="activity-item">
                <span class="activity-item__name">{{ run.workflowName }}</span>
                <span class="activity-item__status" [class]="runStatusClass(run.status)">{{
                  run.status
                }}</span>
                <time class="activity-item__time" [attr.datetime]="run.triggeredAt">
                  {{ formatDate(run.triggeredAt) }}
                </time>
              </li>
            }
          </ul>
        </section>
      }

      <app-progress-section />
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

      .dashboard__status,
      .dashboard__error {
        margin: 0;
        font-size: var(--lab-text-sm);
      }

      .dashboard__status {
        color: var(--lab-ink-soft);
      }

      .dashboard__error {
        color: var(--lab-danger);
        font-weight: 600;
      }

      .dashboard__header h1 {
        font-size: var(--lab-text-3xl);
      }

      .kpi-section {
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-lg);
        background: var(--lab-surface);
        box-shadow: var(--lab-shadow-1);
        padding: var(--lab-space-6);
        display: grid;
        gap: var(--lab-space-2);
      }

      .kpi-section h2 {
        margin: 0;
        font-size: var(--lab-text-xl);
      }

      .kpi-section__grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--lab-space-3);
      }

      @media (max-width: 1280px) {
        .kpi-section__grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 1024px) {
        .kpi-section__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .stages-section {
        display: grid;
        gap: var(--lab-space-4);
      }

      .stages-section__header {
        display: grid;
        gap: var(--lab-space-2);
      }

      .stages-section__header h2,
      .activity-section__header h2 {
        margin: 0;
        font-size: var(--lab-text-xl);
      }

      .stages-section__header p,
      .activity-section__header p {
        margin: 0;
        color: var(--lab-ink-soft);
        font-size: var(--lab-text-sm);
      }

      .stages-section__grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: var(--lab-space-3);
      }

      .stages-section__item {
        display: grid;
        gap: var(--lab-space-1);
        padding: var(--lab-space-4);
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface-muted);
        text-align: center;
      }

      .stages-section__stage {
        font-size: var(--lab-text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--lab-ink-soft);
      }

      .stages-section__count {
        font-size: var(--lab-text-2xl);
        font-family: var(--lab-font-display);
        color: var(--lab-ink);
        line-height: 1;
      }

      .activity-section {
        display: grid;
        gap: var(--lab-space-4);
      }

      .activity-section__header {
        display: grid;
        gap: var(--lab-space-2);
      }

      .activity-section__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--lab-space-2);
      }

      .activity-item {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto auto;
        gap: var(--lab-space-3);
        align-items: center;
        padding: var(--lab-space-3) var(--lab-space-4);
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface-muted);
      }

      .activity-item__name {
        font-weight: 600;
        color: var(--lab-ink);
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .activity-item__status {
        padding: var(--lab-space-1) var(--lab-space-2);
        border-radius: var(--lab-radius-pill);
        font-size: var(--lab-text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        border: 1px solid transparent;
      }

      .activity-item__status--queued {
        background: color-mix(in srgb, var(--lab-info) 15%, var(--lab-surface));
        border-color: color-mix(in srgb, var(--lab-info) 40%, var(--lab-line));
        color: var(--lab-ink);
      }

      .activity-item__status--running {
        background: color-mix(in srgb, var(--lab-warning) 20%, var(--lab-surface));
        border-color: color-mix(in srgb, var(--lab-warning) 45%, var(--lab-line));
        color: var(--lab-ink);
      }

      .activity-item__status--succeeded {
        background: color-mix(in srgb, var(--lab-success) 20%, var(--lab-surface));
        border-color: color-mix(in srgb, var(--lab-success) 45%, var(--lab-line));
        color: var(--lab-ink);
      }

      .activity-item__status--failed {
        background: color-mix(in srgb, var(--lab-danger) 15%, var(--lab-surface));
        border-color: color-mix(in srgb, var(--lab-danger) 40%, var(--lab-line));
        color: var(--lab-ink);
      }

      .activity-item__time {
        font-size: var(--lab-text-sm);
        color: var(--lab-ink-soft);
        white-space: nowrap;
      }

      @media (max-width: 768px) {
        .dashboard {
          width: min(1120px, calc(100% - (var(--lab-space-3) * 2)));
          padding-top: var(--lab-space-6);
        }

        .kpi-section__grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .stages-section__grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .activity-section__list {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly summary = signal<DashboardSummary | null>(null);

  readonly recentRuns = signal<readonly DashboardRecentRun[]>([]);

  readonly isLoading = signal(true);

  readonly loadError = signal<string | null>(null);

  readonly workflowsByStage = computed(() => this.summary()?.workflowsByStage ?? []);

  readonly kpiMetrics = computed<readonly KpiMetric[]>(() => {
    const summary = this.summary();
    if (summary === null) {
      return [
        { title: 'Leads Captured', value: '—', icon: 'LD' },
        { title: 'Active Automations', value: '—', icon: 'AU' },
        { title: 'Workflow Runs', value: '—', icon: 'WF' },
        { title: 'Success Rate', value: '—', icon: 'OK' },
      ];
    }

    const totalRuns =
      summary.queuedRunCount +
      summary.runningRunCount +
      summary.succeededRunCount +
      summary.failedRunCount;
    const successRate =
      totalRuns > 0 ? Math.round((summary.succeededRunCount / totalRuns) * 100) : 0;

    return [
      {
        title: 'Leads Captured',
        value: summary.leadCount.toLocaleString('en-US'),
        icon: 'LD',
      },
      {
        title: 'Active Automations',
        value: summary.activeWorkflowCount.toLocaleString('en-US'),
        icon: 'AU',
      },
      {
        title: 'Workflow Runs',
        value: totalRuns.toLocaleString('en-US'),
        icon: 'WF',
      },
      {
        title: 'Success Rate',
        value: `${successRate}%`,
        icon: 'OK',
      },
    ];
  });

  ngOnInit(): void {
    void this.loadAll();
  }

  runStatusClass(status: DashboardRecentRun['status']): string {
    return `activity-item__status activity-item__status--${status}`;
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private async loadAll(): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(null);

    try {
      const [summary, runs] = await Promise.all([
        this.dashboardService.loadSummary(),
        this.dashboardService.loadRecentRuns(10),
      ]);
      this.summary.set(summary);
      this.recentRuns.set(runs);
    } catch {
      this.loadError.set('Unable to load live dashboard summary right now.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
