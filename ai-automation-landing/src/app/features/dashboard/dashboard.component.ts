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
import { OnboardingGuideComponent } from './onboarding-guide.component';
import { ProgressSectionComponent } from './progress-section.component';

interface KpiMetric {
  readonly title: string;
  readonly value: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    KpiCardComponent,
    ProgressSectionComponent,
    QuickActionShortcutsComponent,
    OnboardingGuideComponent,
  ],
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

      <app-onboarding-guide />

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
        <section class="stages-section surface-card" aria-label="Workflow stages">
          <header class="stages-section__header">
            <h2>Workflows by Stage</h2>
            <p>Distribution of current automations by delivery stage.</p>
          </header>

          <div class="stages-section__grid" role="list" aria-label="Workflow stage counts">
            @for (stage of workflowsByStage(); track stage.stage) {
              <article class="stages-section__item" role="listitem">
                <h3 class="stages-section__stage">{{ stage.stage }}</h3>
                <p class="stages-section__count">{{ stage.count }}</p>
              </article>
            }
          </div>
        </section>
      }

      <section class="activity-section surface-card" aria-label="Recent run activity">
        <header class="activity-section__header">
          <h2>Recent Activity</h2>
          <p>
            Showing {{ recentRuns().length }} of {{ recentRunsTotal() }} workflow runs across all
            automations.
          </p>
        </header>

        @if (isRunsLoading()) {
          <div class="activity-section__skeleton" aria-hidden="true">
            @for (placeholder of [1, 2, 3]; track placeholder) {
              <div class="activity-section__skeleton-row"></div>
            }
          </div>
        } @else if (recentRuns().length > 0) {
          <ul class="activity-section__list" aria-label="Recent workflow runs">
            @for (run of recentRuns(); track run.runId) {
              <li class="activity-item">
                <span class="activity-item__name">{{ run.workflowName }}</span>
                <span class="activity-item__status" [class]="runStatusClass(run.status)">
                  {{ run.status }}
                </span>
                <time class="activity-item__time" [attr.datetime]="run.triggeredAt">
                  {{ formatDate(run.triggeredAt) }}
                </time>
              </li>
            }
          </ul>
        } @else {
          <p class="activity-section__empty">
            No workflow runs yet. Trigger a run to populate activity.
          </p>
        }

        <footer class="activity-section__pagination">
          <label class="activity-section__page-size-label" for="activity-page-size">Rows</label>
          <select
            id="activity-page-size"
            class="activity-section__page-size"
            [value]="runsPageSize()"
            [disabled]="isRunsLoading() || isLoading()"
            (change)="onRunsPageSizeChange($any($event.target).value)"
          >
            @for (size of runsPageSizeOptions; track size) {
              <option [value]="size">{{ size }}</option>
            }
          </select>

          <button
            type="button"
            class="activity-section__page-button"
            [disabled]="!canGoToFirstRunsPage()"
            (click)="goToFirstRunsPage()"
          >
            First
          </button>
          <button
            type="button"
            class="activity-section__page-button"
            [disabled]="!canGoToPreviousRunsPage()"
            (click)="goToPreviousRunsPage()"
          >
            Previous
          </button>
          <span class="activity-section__page-label">{{ runsPaginationLabel() }}</span>
          <button
            type="button"
            class="activity-section__page-button"
            [disabled]="!canGoToNextRunsPage()"
            (click)="goToNextRunsPage()"
          >
            Next
          </button>
          <button
            type="button"
            class="activity-section__page-button"
            [disabled]="!canGoToLastRunsPage()"
            (click)="goToLastRunsPage()"
          >
            Last
          </button>
        </footer>
      </section>

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

      .activity-section__pagination {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--lab-space-2);
        flex-wrap: wrap;
      }

      .activity-section__page-size-label,
      .activity-section__page-size {
        font-size: var(--lab-text-sm);
      }

      .activity-section__page-size {
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface);
        color: var(--lab-ink);
        padding: 0 var(--lab-space-2);
        height: 2rem;
      }

      .activity-section__page-button {
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        color: var(--lab-ink);
        border-radius: var(--lab-radius-md);
        padding: var(--lab-space-1) var(--lab-space-3);
        font-size: var(--lab-text-sm);
        font-weight: 600;
        cursor: pointer;
      }

      .activity-section__page-button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .activity-section__page-label {
        font-size: var(--lab-text-sm);
        color: var(--lab-ink-soft);
      }

      .activity-section__empty {
        margin: 0;
        color: var(--lab-ink-soft);
        font-size: var(--lab-text-sm);
      }

      .activity-section__skeleton {
        display: grid;
        gap: var(--lab-space-2);
      }

      .activity-section__skeleton-row {
        height: 2.75rem;
        border-radius: var(--lab-radius-md);
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--lab-line) 60%, var(--lab-surface)) 0%,
          color-mix(in srgb, var(--lab-line) 20%, var(--lab-surface)) 50%,
          color-mix(in srgb, var(--lab-line) 60%, var(--lab-surface)) 100%
        );
        background-size: 240px 100%;
        animation: activity-skeleton-shimmer 1.2s ease-in-out infinite;
      }

      @keyframes activity-skeleton-shimmer {
        from {
          background-position: -120px 0;
        }
        to {
          background-position: 120px 0;
        }
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

  readonly runsPageSizeOptions = [10, 25, 50] as const;

  readonly summary = signal<DashboardSummary | null>(null);

  readonly recentRuns = signal<readonly DashboardRecentRun[]>([]);

  readonly recentRunsTotal = signal(0);

  readonly runsPage = signal(1);

  readonly runsPageSize = signal<number>(10);

  readonly isLoading = signal(true);

  readonly isRunsLoading = signal(false);

  readonly loadError = signal<string | null>(null);

  readonly workflowsByStage = computed(() => this.summary()?.workflowsByStage ?? []);

  readonly runsPaginationLabel = computed(() => {
    const total = this.recentRunsTotal();
    if (total <= 0) {
      return 'Page 1 of 1';
    }

    const currentPage = this.runsPage();
    const pageCount = Math.max(1, Math.ceil(total / this.runsPageSize()));
    return `Page ${currentPage} of ${pageCount}`;
  });

  readonly kpiMetrics = computed<readonly KpiMetric[]>(() => {
    const summary = this.summary();
    if (summary === null) {
      return [
        { title: 'Leads Captured', value: '—', icon: 'LD' },
        { title: 'Active Automations', value: '—', icon: 'AU' },
        { title: 'Tasks Automated', value: '—', icon: 'WF' },
        { title: 'Hours Saved', value: '—', icon: 'OK' },
      ];
    }

    const totalRuns = summary.totalRunCount;
    const tasksAutomatedDisplay =
      totalRuns > 0 ? totalRuns.toLocaleString('en-US') : 'No activity yet';
    const hoursSavedDisplay = summary.hasImpactData
      ? `${this.formatHours(summary.totalEstimatedHoursSaved)}h`
      : 'No impact data yet';

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
        title: 'Tasks Automated',
        value: tasksAutomatedDisplay,
        icon: 'WF',
      },
      {
        title: 'Hours Saved',
        value: hoursSavedDisplay,
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

  private formatHours(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }

  canGoToPreviousRunsPage(): boolean {
    return this.runsPage() > 1 && !this.isRunsLoading() && !this.isLoading();
  }

  canGoToNextRunsPage(): boolean {
    return (
      this.runsPage() * this.runsPageSize() < this.recentRunsTotal() &&
      !this.isRunsLoading() &&
      !this.isLoading()
    );
  }

  canGoToFirstRunsPage(): boolean {
    return this.canGoToPreviousRunsPage();
  }

  canGoToLastRunsPage(): boolean {
    return this.canGoToNextRunsPage();
  }

  async goToPreviousRunsPage(): Promise<void> {
    if (!this.canGoToPreviousRunsPage()) {
      return;
    }

    await this.loadRunsPage(this.runsPage() - 1);
  }

  async goToFirstRunsPage(): Promise<void> {
    if (!this.canGoToFirstRunsPage()) {
      return;
    }

    await this.loadRunsPage(1);
  }

  async goToNextRunsPage(): Promise<void> {
    if (!this.canGoToNextRunsPage()) {
      return;
    }

    await this.loadRunsPage(this.runsPage() + 1);
  }

  async goToLastRunsPage(): Promise<void> {
    if (!this.canGoToLastRunsPage()) {
      return;
    }

    const lastPage = Math.max(1, Math.ceil(this.recentRunsTotal() / this.runsPageSize()));
    await this.loadRunsPage(lastPage);
  }

  async onRunsPageSizeChange(rawValue: string): Promise<void> {
    const nextPageSize = Number.parseInt(rawValue, 10);
    if (
      !Number.isFinite(nextPageSize) ||
      nextPageSize <= 0 ||
      nextPageSize === this.runsPageSize()
    ) {
      return;
    }

    this.runsPageSize.set(nextPageSize);
    this.runsPage.set(1);
    await this.loadRunsPage(1);
  }

  private async loadAll(): Promise<void> {
    this.isLoading.set(true);
    this.isRunsLoading.set(true);
    this.loadError.set(null);

    try {
      const [summary, recentRunsPage] = await Promise.all([
        this.dashboardService.loadSummary(),
        this.dashboardService.loadRecentRuns(this.runsPage(), this.runsPageSize()),
      ]);
      this.summary.set(summary);
      this.runsPage.set(recentRunsPage.page);
      this.recentRuns.set(recentRunsPage.data);
      this.recentRunsTotal.set(recentRunsPage.total);
    } catch {
      this.loadError.set('Unable to load live dashboard summary right now.');
      this.recentRuns.set([]);
      this.recentRunsTotal.set(0);
    } finally {
      this.isRunsLoading.set(false);
      this.isLoading.set(false);
    }
  }

  private async loadRunsPage(page: number): Promise<void> {
    this.isRunsLoading.set(true);
    this.loadError.set(null);

    try {
      const runsPage = await this.dashboardService.loadRecentRuns(page, this.runsPageSize());
      this.runsPage.set(runsPage.page);
      this.recentRuns.set(runsPage.data);
      this.recentRunsTotal.set(runsPage.total);
    } catch {
      this.loadError.set('Unable to load recent run activity right now.');
    } finally {
      this.isRunsLoading.set(false);
    }
  }
}
