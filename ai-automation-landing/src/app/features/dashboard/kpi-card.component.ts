import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="kpi" [attr.aria-label]="title() + ' KPI card'">
      @if (icon()) {
        <p class="kpi__icon" aria-hidden="true">{{ icon() }}</p>
      }

      <p class="kpi__title">{{ title() }}</p>
      <p class="kpi__value">{{ value() }}</p>
    </article>
  `,
  styles: [
    `
      .kpi {
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-lg);
        background: var(--lab-surface-muted);
        box-shadow: var(--lab-shadow-1);
        padding: var(--lab-space-4);
        display: grid;
        gap: var(--lab-space-2);
        min-width: 0;
      }

      .kpi__icon {
        margin: 0;
        font-size: var(--lab-text-lg);
        line-height: 1;
      }

      .kpi__title {
        margin: 0;
        font-size: var(--lab-text-sm);
        color: var(--lab-ink-soft);
        font-weight: 600;
      }

      .kpi__value {
        margin: 0;
        font-size: clamp(var(--lab-text-xl), 4vw, var(--lab-text-3xl));
        color: var(--lab-ink);
        font-family: var(--lab-font-display);
        line-height: 1;
      }
    `,
  ],
})
export class KpiCardComponent {
  readonly title = input.required<string>();

  readonly value = input.required<string>();

  readonly icon = input<string>('');
}
