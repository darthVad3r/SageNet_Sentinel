import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LandingContentService } from '../../core/services/landing-content.service';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { FeatureCardComponent } from '../../shared/ui/feature-card.component';

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [CtaButtonComponent, FeatureCardComponent],
  template: `
    <section class="page-shell">
      <div class="page-shell__inner">
        <div class="page-shell__content">
          <p class="page-shell__eyebrow">Strategy booking</p>
          <h1>Book the architecture call.</h1>
          <p>
            Use this route for your consultation CTA. It stays visually aligned with the landing
            page, but narrows the message to one conversion action.
          </p>
          <app-cta-button
            label="Open booking calendar"
            [link]="bookingUrl"
            [external]="true"
          ></app-cta-button>
        </div>

        <app-feature-card
          eyebrow="Why this route exists"
          title="Focused conversion page"
          body="The booking module can grow independently with FAQs, intake forms, or embedded schedulers without affecting the homepage module."
        ></app-feature-card>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell {
        padding: 3rem 0;
      }

      .page-shell__inner {
        width: min(960px, calc(100% - 2rem));
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
        gap: 1rem;
        align-items: start;
      }

      .page-shell__content {
        padding: clamp(1.5rem, 3vw, 2.4rem);
        border-radius: 1.6rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        box-shadow: var(--lab-shadow-2);
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
        color: var(--lab-color-primary-strong);
      }

      h1 {
        margin-top: 0.8rem;
        font-size: clamp(2rem, 4vw, 3.6rem);
        line-height: 1.05;
      }

      p {
        margin-top: 1rem;
        color: var(--lab-ink-soft);
        line-height: 1.7;
        max-width: 42rem;
      }

      app-cta-button {
        display: inline-block;
        margin-top: 1.5rem;
      }

      @media (max-width: 840px) {
        .page-shell__inner {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .page-shell__inner {
          width: min(960px, calc(100% - 1.25rem));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPageComponent {
  private readonly contentService = inject(LandingContentService);

  readonly bookingUrl = this.contentService.bookingUrl;
}
