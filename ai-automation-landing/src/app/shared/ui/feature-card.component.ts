import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  template: `
    <article class="card">
      @if (eyebrow) {
        <p class="card__eyebrow">{{ eyebrow }}</p>
      }
      <h3>{{ title }}</h3>
      <p class="card__body">{{ body }}</p>
    </article>
  `,
  styles: [
    `
      .card {
        height: 100%;
        padding: 1.35rem;
        border-radius: 1.2rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        box-shadow: var(--lab-shadow);
      }

      .card__eyebrow,
      h3,
      .card__body {
        margin: 0;
      }

      .card__eyebrow {
        margin-bottom: 0.55rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--lab-accent-strong);
      }

      h3 {
        font-size: 1.1rem;
      }

      .card__body {
        margin-top: 0.65rem;
        color: var(--lab-ink-soft);
        line-height: 1.6;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureCardComponent {
  @Input() eyebrow = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) body = '';
}
