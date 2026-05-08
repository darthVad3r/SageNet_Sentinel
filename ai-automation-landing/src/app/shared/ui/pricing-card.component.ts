import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { CtaButtonComponent } from './cta-button.component';
import { PricingPlan } from '../../core/services/landing-content.service';

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
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 1rem;
        padding: 1.25rem;
        display: grid;
        gap: 0.75rem;
      }

      .card.highlighted {
        border-color: #4f46e5;
        box-shadow: 0 8px 24px rgba(79, 70, 229, 0.14);
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
        color: #4b5563;
      }

      .card__features {
        margin: 0;
        padding-left: 1.1rem;
        color: #374151;
        display: grid;
        gap: 0.35rem;
      }
    `
  ]
})
export class PricingCardComponent {
  @Input({ required: true }) plan!: PricingPlan;
}
