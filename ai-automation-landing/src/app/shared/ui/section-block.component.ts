import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-block',
  standalone: true,
  imports: [],
  template: `
    <section
      class="section"
      [class.light]="variant === 'light'"
      [class.muted]="variant === 'muted'"
    >
      <div class="section__inner">
        @if (eyebrow) {
          <p class="section__eyebrow">{{ eyebrow }}</p>
        }
        <h2 class="section__title">{{ title }}</h2>
        @if (subtitle) {
          <p class="section__subtitle">{{ subtitle }}</p>
        }
        <ng-content></ng-content>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .section {
        padding: 3.5rem 1.25rem;
      }

      .section.light {
        background: var(--lab-surface);
      }

      .section.muted {
        background: var(--lab-surface-muted);
      }

      .section__inner {
        max-width: 1080px;
        margin: 0 auto;
      }

      .section__eyebrow {
        margin: 0 0 0.5rem;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        color: var(--lab-color-primary-strong);
        font-weight: 700;
      }

      .section__title {
        margin: 0;
        font-size: clamp(1.5rem, 2.5vw, 2rem);
        line-height: 1.2;
      }

      .section__subtitle {
        margin-top: 0.75rem;
        max-width: 720px;
        color: var(--lab-ink-soft);
      }
    `,
  ],
})
export class SectionBlockComponent {
  @Input({ required: true }) title = '';

  @Input() eyebrow = '';

  @Input() subtitle = '';

  @Input() variant: 'light' | 'muted' = 'light';
}
