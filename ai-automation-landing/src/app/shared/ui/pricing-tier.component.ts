import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PricingPlan } from '../../core/services/landing-content.service';
import { CtaButtonComponent } from './cta-button.component';

@Component({
  selector: 'app-pricing-tier',
  standalone: true,
  imports: [NgClass, CtaButtonComponent],
  template: `
    <article class="tier" [ngClass]="{ 'tier--featured': plan.highlighted }">
      <p class="tier__eyebrow">Pricing Tier</p>
      <h3>{{ plan.name }}</h3>
      <p class="tier__price">{{ plan.price }}</p>
      <p class="tier__description">{{ plan.description }}</p>

      <ul class="tier__features">
        @for (feature of plan.features; track feature) {
          <li>{{ feature }}</li>
        }
      </ul>

      <app-cta-button [label]="plan.ctaLabel" [link]="plan.ctaLink"></app-cta-button>
    </article>
  `,
  styles: [
    `
      .tier {
        display: grid;
        gap: 0.85rem;
        height: 100%;
        padding: 1.5rem;
        border-radius: 1.4rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface-strong);
        box-shadow: var(--lab-shadow);
      }

      .tier--featured {
        border-color: rgba(15, 118, 110, 0.35);
        transform: translateY(-0.35rem);
      }

      .tier__eyebrow,
      h3,
      .tier__price,
      .tier__description {
        margin: 0;
      }

      .tier__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.72rem;
        color: var(--lab-accent-strong);
        font-weight: 700;
      }

      h3 {
        font-size: 1.2rem;
      }

      .tier__price {
        font-size: 2rem;
        font-weight: 800;
      }

      .tier__description {
        color: var(--lab-ink-soft);
        line-height: 1.6;
      }

      .tier__features {
        margin: 0;
        padding-left: 1.1rem;
        display: grid;
        gap: 0.45rem;
        color: var(--lab-ink-soft);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingTierComponent {
  @Input({ required: true }) plan!: PricingPlan;
}
