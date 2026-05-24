import { ChangeDetectionStrategy, Component } from '@angular/core';
import { projectProgressMock } from '../../../components/dashboard/ProgressSection/progress.mock';
import type {
  ProgressRecord,
  ProgressStatus,
} from '../../../components/dashboard/ProgressSection/progress.types';

@Component({
  selector: 'app-progress-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="progress surface-card" aria-labelledby="progress-title">
      <header class="progress__header">
        <h2 id="progress-title">Project Progress</h2>
        <p>Current delivery status for major platform modules.</p>
      </header>

      <ul class="progress__list" aria-label="Project progress timeline">
        @for (item of items; track item.id) {
          <li class="progress__item">
            <div class="progress__top">
              <h3 class="progress__title">{{ item.title }}</h3>
              <span class="progress__status" [class]="statusClass(item.status)">
                {{ statusLabel(item.status) }}
              </span>
            </div>

            <p class="progress__percent">{{ percentage(item.percent) }}% complete</p>

            <progress
              class="progress__bar"
              [attr.aria-label]="item.title + ' progress'"
              [value]="percentage(item.percent)"
              [max]="100"
            ></progress>
          </li>
        }
      </ul>
    </section>
  `,
  styles: [
    `
      .progress {
        display: grid;
        gap: var(--lab-space-6);
      }

      .progress__header {
        display: grid;
        gap: var(--lab-space-2);
      }

      .progress__header h2 {
        margin: 0;
        font-size: var(--lab-text-xl);
      }

      .progress__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--lab-space-3);
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .progress__item {
        padding: var(--lab-space-4);
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface-muted);
        display: grid;
        gap: var(--lab-space-3);
        align-content: start;
        min-width: 0;
      }

      .progress__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lab-space-2);
      }

      .progress__title {
        margin: 0;
        color: var(--lab-ink);
        font-size: var(--lab-text-md);
      }

      .progress__status {
        border-radius: var(--lab-radius-pill);
        padding: var(--lab-space-1) var(--lab-space-2);
        font-size: var(--lab-text-xs);
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        border: 1px solid transparent;
      }

      .progress__status--complete {
        color: #0b3d2e;
        background: #d1fae5;
        border-color: #34d399;
      }

      .progress__status--in-progress {
        color: #102a56;
        background: #dbeafe;
        border-color: #60a5fa;
      }

      .progress__status--planned {
        color: #4a3500;
        background: #fef3c7;
        border-color: #fbbf24;
      }

      .progress__status--blocked {
        color: #5b1111;
        background: #fee2e2;
        border-color: #f87171;
      }

      .progress__percent {
        margin: 0;
        font-size: var(--lab-text-sm);
        color: var(--lab-ink-soft);
      }

      .progress__bar {
        height: 0.625rem;
        width: 100%;
        border: 0;
        border-radius: var(--lab-radius-pill);
        background: color-mix(in srgb, var(--lab-line) 80%, transparent);
        overflow: hidden;
      }

      .progress__bar::-webkit-progress-bar {
        background: color-mix(in srgb, var(--lab-line) 80%, transparent);
        border-radius: var(--lab-radius-pill);
      }

      .progress__bar::-webkit-progress-value {
        background: linear-gradient(90deg, var(--lab-color-primary), var(--lab-color-accent-cyan));
        border-radius: var(--lab-radius-pill);
      }

      .progress__bar::-moz-progress-bar {
        background: linear-gradient(90deg, var(--lab-color-primary), var(--lab-color-accent-cyan));
      }

      @media (max-width: 1024px) {
        .progress__list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .progress__list {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class ProgressSectionComponent {
  readonly items: readonly ProgressRecord[] = projectProgressMock;

  percentage(value?: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 0;
    }

    return Math.max(0, Math.min(100, Math.round(value)));
  }

  statusLabel(status: ProgressStatus): string {
    const labels: Record<ProgressStatus, string> = {
      complete: 'Complete',
      'in-progress': 'In Progress',
      planned: 'Planned',
      blocked: 'Blocked',
    };

    return labels[status];
  }

  statusClass(status: ProgressStatus): string {
    return `progress__status progress__status--${status}`;
  }
}
