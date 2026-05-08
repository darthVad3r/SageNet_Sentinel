import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LandingContentService } from '../../core/services/landing-content.service';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { FeatureCardComponent } from '../../shared/ui/feature-card.component';

@Component({
  selector: 'app-kit-page',
  standalone: true,
  imports: [CtaButtonComponent, FeatureCardComponent],
  template: `
    <section class="page-shell">
      <div class="page-shell__inner">
        <div class="page-shell__content">
          <p class="page-shell__eyebrow">Digital product route</p>
          <h1>Sell the starter kit from the same Angular shell.</h1>
          <p>
            Keep the productized offer in its own module while still sharing navigation,
            SEO handling, CTA styles, and responsive layout primitives.
          </p>
          <app-cta-button
            label="Continue to checkout"
            [link]="checkoutUrl"
            [external]="true"
          ></app-cta-button>
        </div>

        <div class="page-shell__stack">
          <app-feature-card
            eyebrow="Included"
            title="Templates and workflow assets"
            body="Use this route for prompts, implementation playbooks, sample automations, or paid starter kits."
          ></app-feature-card>
          <app-feature-card
            eyebrow="Shared foundation"
            title="No duplicate layout code"
            body="The module only owns the conversion message. The global shell, tokens, and metadata plumbing stay centralized."
          ></app-feature-card>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell {
        padding: 3rem 0;
      }

      .page-shell__inner {
        width: min(1020px, calc(100% - 2rem));
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
        gap: 1rem;
        align-items: start;
      }

      .page-shell__content {
        padding: clamp(1.5rem, 3vw, 2.4rem);
        border-radius: 1.6rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface-strong);
        box-shadow: var(--lab-shadow);
      }

      .page-shell__stack {
        display: grid;
        gap: 1rem;
      }

      .page-shell__eyebrow,
      h1,
      p {
        margin: 0;
      }

      .page-shell__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.74rem;
        font-weight: 700;
        color: var(--lab-accent-strong);
      }

      h1 {
        margin-top: 0.8rem;
        font-size: clamp(2rem, 4vw, 3.6rem);
        line-height: 1.04;
      }

      p {
        margin-top: 1rem;
        color: var(--lab-ink-soft);
        line-height: 1.7;
        max-width: 44rem;
      }

      app-cta-button {
        display: inline-block;
        margin-top: 1.5rem;
      }

      @media (max-width: 900px) {
        .page-shell__inner {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .page-shell__inner {
          width: min(1020px, calc(100% - 1.25rem));
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KitPageComponent {
  private readonly contentService = inject(LandingContentService);

  readonly checkoutUrl = this.contentService.kitCheckoutUrl;
}
