import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="login-page">
      <div class="login-page__inner">
        <p class="login-page__eyebrow">Authentication required</p>
        <h1>Sign in to continue.</h1>
        <p class="login-page__message">
          Your session is not authenticated. Use your sign-in flow here before accessing protected
          routes.
        </p>
        <a class="login-page__cta" routerLink="/landing">Return home</a>
      </div>
    </section>
  `,
  styles: [
    `
      .login-page {
        padding: 3rem 0;
      }

      .login-page__inner {
        width: min(960px, calc(100% - 2rem));
        margin: 0 auto;
        padding: clamp(1.5rem, 3vw, 2.5rem);
        border-radius: 1.6rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        box-shadow: var(--lab-shadow-2);
      }

      .login-page__eyebrow,
      h1,
      .login-page__message {
        margin: 0;
      }

      .login-page__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--lab-color-primary-strong);
      }

      h1 {
        margin-top: 0.8rem;
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 1.05;
      }

      .login-page__message {
        margin-top: 1rem;
        color: var(--lab-ink-soft);
        line-height: 1.7;
        max-width: 56ch;
      }

      .login-page__cta {
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
        .login-page__inner {
          width: min(960px, calc(100% - 1.25rem));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {}
