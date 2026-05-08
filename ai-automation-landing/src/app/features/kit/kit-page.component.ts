import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { LandingContentService } from '../../core/services/landing-content.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-kit-page',
  standalone: true,
  imports: [CtaButtonComponent],
  template: `
    <main class="page">
      <div class="page__inner">
        <h1>AI Agent Starter Kit</h1>
        <p>
          Proceed to the checkout to access templates, starter architecture, and workflow assets.
        </p>
        <app-cta-button
          label="Go to checkout"
          [link]="checkoutUrl"
          [external]="true"
        ></app-cta-button>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .page {
        min-height: 100dvh;
        display: grid;
        place-items: center;
        padding: 1.25rem;
      }

      .page__inner {
        max-width: 720px;
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid #e5e7eb;
        background: #ffffff;
      }

      h1 {
        margin: 0;
      }

      p {
        margin: 0.75rem 0 1.25rem;
        color: #4b5563;
      }
    `
  ]
})
export class KitPageComponent implements OnInit {
  private readonly contentService = inject(LandingContentService);
  private readonly seoService = inject(SeoService);

  readonly checkoutUrl = this.contentService.kitCheckoutUrl;

  ngOnInit(): void {
    this.seoService.setPageMeta(
      'AI Agent Starter Kit | Checkout',
      'Checkout page for the AI Agent Starter Kit product with workflow templates and implementation assets.'
    );
  }
}
