import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LandingContentService } from '../../core/services/landing-content.service';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { FeatureCardComponent } from '../../shared/ui/feature-card.component';
import { PricingTierComponent } from '../../shared/ui/pricing-tier.component';
import { SectionBlockComponent } from '../../shared/ui/section-block.component';
import { TestimonialCardComponent } from '../../shared/ui/testimonial-card.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    SectionBlockComponent,
    CtaButtonComponent,
    PricingTierComponent,
    TestimonialCardComponent,
    FeatureCardComponent,
  ],
  template: `
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__copy">
          <p class="hero__eyebrow">Angular + Vite-ready AI delivery system</p>
          <h1>Launch AI workflow offers on a modular Angular architecture.</h1>
          <p class="hero__subtitle">
            AI Automation Lab gives you a landing scaffold with route-level SEO, reusable UI, and
            service modules for consulting, booking, and digital kit sales.
          </p>

          <div class="hero__actions">
            <app-cta-button label="Book a strategy call" link="/book"></app-cta-button>
            <app-cta-button label="Explore the starter kit" link="/kit"></app-cta-button>
          </div>
        </div>

        <div class="hero__panel">
          <app-feature-card
            eyebrow="Architecture"
            title="Feature modules + shared UI"
            body="A route tree anchored in modules, backed by core services and shared visual building blocks."
          ></app-feature-card>
          <app-feature-card
            eyebrow="Delivery"
            title="SEO and responsive layout built in"
            body="Each route declares metadata while the shared shell handles layout, navigation, and mobile-friendly spacing."
          ></app-feature-card>
        </div>
      </div>
    </section>

    <app-section-block
      eyebrow="Why teams stall"
      title="AI projects fail when the interface and the workflow architecture diverge."
      subtitle="This scaffold keeps marketing pages, offer pages, and reusable components on the same delivery path."
      variant="light"
    >
      <div class="feature-grid">
        @for (item of problemPoints; track item) {
          <app-feature-card
            eyebrow="Problem"
            title="Execution gap"
            [body]="item"
          ></app-feature-card>
        }
      </div>
    </app-section-block>

    <app-section-block
      eyebrow="What ships"
      title="A modular landing stack you can expand instead of replace."
      subtitle="Use shared components for new offers, duplicate modules for new pages, and keep content in one core service."
      variant="muted"
    >
      <div class="feature-grid">
        @for (item of solutionPoints; track item) {
          <app-feature-card
            eyebrow="Solution"
            title="Reusable by default"
            [body]="item"
          ></app-feature-card>
        }
      </div>
    </app-section-block>

    <app-section-block
      eyebrow="Pricing"
      title="Reusable pricing tiers for services and productized offers."
      subtitle="The pricing grid uses a shared pricing-tier component so you can add or reorder offers without touching layout logic."
      variant="light"
    >
      <div class="pricing-grid">
        @for (plan of pricingPlans; track plan.name) {
          <app-pricing-tier [plan]="plan"></app-pricing-tier>
        }
      </div>
    </app-section-block>

    <app-section-block
      eyebrow="Starter kit"
      title="Package the architecture as a product."
      subtitle="Use the /kit route to sell templates, prompts, and implementation assets from the same app scaffold."
      variant="muted"
    >
      <div class="feature-grid">
        @for (item of starterKitPoints; track item) {
          <app-feature-card eyebrow="Kit" title="Reusable asset" [body]="item"></app-feature-card>
        }
      </div>
    </app-section-block>

    <app-section-block
      eyebrow="Proof"
      title="Shared testimonial cards are ready for real customer proof."
      subtitle="Replace the placeholder content as soon as you have verified client outcomes."
      variant="light"
    >
      <div class="testimonial-grid">
        @for (testimonial of testimonials; track testimonial.quote) {
          <app-testimonial-card
            [quote]="testimonial.quote"
            [name]="testimonial.name"
            [role]="testimonial.role"
          ></app-testimonial-card>
        }
      </div>
    </app-section-block>
  `,
  styles: [
    `
      .hero {
        padding: 3rem 0 1.5rem;
      }

      .hero__inner {
        width: min(1120px, calc(100% - 2rem));
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.85fr);
        gap: 1.25rem;
        align-items: stretch;
      }

      .hero__copy,
      .hero__panel {
        border: 1px solid var(--lab-line);
        box-shadow: var(--lab-shadow-2);
      }

      .hero__copy {
        padding: clamp(1.5rem, 3vw, 3rem);
        border-radius: 1.8rem;
        background: linear-gradient(135deg, var(--lab-surface), var(--lab-surface-muted));
      }

      .hero__eyebrow,
      h1,
      .hero__subtitle {
        margin: 0;
      }

      .hero__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.76rem;
        font-weight: 700;
        color: var(--lab-color-primary-strong);
      }

      h1 {
        margin-top: 1rem;
        font-size: clamp(2.4rem, 5vw, 4.8rem);
        line-height: 0.98;
        max-width: 10ch;
      }

      .hero__subtitle {
        margin-top: 1.1rem;
        max-width: 44rem;
        font-size: 1.05rem;
        line-height: 1.7;
        color: var(--lab-ink-soft);
      }

      .hero__actions {
        margin-top: 1.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
      }

      .hero__panel {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        border-radius: 1.8rem;
        background: var(--lab-surface-overlay);
      }

      .feature-grid,
      .pricing-grid,
      .testimonial-grid {
        display: grid;
        gap: 1rem;
        margin-top: 1.2rem;
      }

      .feature-grid,
      .testimonial-grid,
      .pricing-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      @media (max-width: 1024px) {
        .hero__inner,
        .feature-grid,
        .pricing-grid,
        .testimonial-grid {
          grid-template-columns: 1fr;
        }

        h1 {
          max-width: none;
        }
      }

      @media (max-width: 768px) {
        .hero__inner {
          width: min(1120px, calc(100% - 1.25rem));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  private readonly landingContentService = inject(LandingContentService);

  readonly problemPoints = this.landingContentService.getProblemPoints();

  readonly solutionPoints = this.landingContentService.getSolutionPoints();

  readonly pricingPlans = this.landingContentService.getPricingPlans();

  readonly starterKitPoints = this.landingContentService.getStarterKitPoints();

  readonly testimonials = this.landingContentService.getTestimonials();
}
