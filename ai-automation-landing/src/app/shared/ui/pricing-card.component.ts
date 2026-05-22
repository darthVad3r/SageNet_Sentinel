import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PricingPlan } from '../../core/services/landing-content.service';
import { CtaButtonComponent } from './cta-button.component';

@Component({
  selector: 'app-pricing-card',
  standalone: true,
  imports: [NgClass, CtaButtonComponent],
  template: `
    <article class="card" [ngClass]="{ highlighted: plan.highlighted }">
      <h3 class="card__title">{{ plan.name }}</h3>
      <p class="card__price">{{ plan.price }}</p>
      <p class="card__description">{{ plan.description }}</p>

      <ul class="card__features">
        @for (feature of plan.features; track feature) {
          <li>{{ feature }}</li>
        }
      </ul>

      <app-cta-button [label]="plan.ctaLabel" [link]="plan.ctaLink"></app-cta-button>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .card {
        background: var(--lab-surface);
        border: 1px solid var(--lab-line);
        border-radius: 1rem;
        padding: 1.25rem;
        display: grid;
        gap: 0.75rem;
      }

      .card.highlighted {
        border-color: var(--lab-color-primary-strong);
        box-shadow: var(--lab-shadow-2);
      }

      .card__title,
      .card__price,
      .card__description {
        margin: 0;
      }

      .card__title {
        font-size: 1.1rem;
      }

      .card__price {
        font-size: 1.8rem;
        font-weight: 700;
      }

      .card__description {
        color: var(--lab-ink-soft);
      }

      .card__features {
        margin: 0;
        padding-left: 1.1rem;
        color: var(--lab-ink-soft);
        display: grid;
        gap: 0.35rem;
      }
    `,
  ],
})
export class PricingCardComponent {
  @Input({ required: true }) plan!: PricingPlan;
}
