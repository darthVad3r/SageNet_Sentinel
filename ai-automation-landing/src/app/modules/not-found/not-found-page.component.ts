import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <div class="not-found__inner">
        <p class="not-found__code">404</p>
        <h1>Page not found.</h1>
        <p class="not-found__message">
          The route you requested does not exist. Use the primary navigation or return to the
          homepage.
        </p>
        <a class="not-found__cta" routerLink="/">Return home</a>
      </div>
    </section>
  `,
  styles: [
    `
      .not-found {
        padding: 3rem 0;
      }

      .not-found__inner {
        width: min(960px, calc(100% - 2rem));
        margin: 0 auto;
        padding: clamp(1.5rem, 3vw, 2.5rem);
        border-radius: 1.6rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface-strong);
        box-shadow: var(--lab-shadow);
      }

      .not-found__code,
      h1,
      .not-found__message {
        margin: 0;
      }

      .not-found__code {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--lab-accent-strong);
      }

      h1 {
        margin-top: 0.8rem;
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 1.05;
      }

      .not-found__message {
        margin-top: 1rem;
        color: var(--lab-ink-soft);
        line-height: 1.7;
        max-width: 56ch;
      }

      .not-found__cta {
        display: inline-block;
        margin-top: 1.4rem;
        border-radius: 999px;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        color: var(--lab-ink);
        text-decoration: none;
        font-weight: 600;
        padding: 0.7rem 1.1rem;
      }

      @media (max-width: 720px) {
        .not-found__inner {
          width: min(960px, calc(100% - 1.25rem));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
