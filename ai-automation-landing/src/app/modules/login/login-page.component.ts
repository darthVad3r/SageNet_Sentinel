import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="login-page">
      <div class="login-page__inner">
        <p class="login-page__eyebrow">Authentication required</p>
        <h1>Sign in to continue.</h1>
        <p class="login-page__message">
          Access to internal routes is restricted to approved users. Sign in to continue to your
          workspace.
        </p>

        <form class="login-page__form" (ngSubmit)="submit()">
          <label class="login-page__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autocomplete="email"
              [(ngModel)]="email"
              placeholder="owner@ai-automation-lab.local"
              required
            />
          </label>

          <label class="login-page__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autocomplete="current-password"
              [(ngModel)]="password"
              placeholder="Enter your password"
              required
            />
          </label>

          @if (errorMessage()) {
            <p class="login-page__error" role="alert">{{ errorMessage() }}</p>
          }

          <button type="submit" class="login-page__submit" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="login-page__hint">Use credentials provisioned in runtime auth configuration.</p>

        @if (redirectTarget()) {
          <p class="login-page__target">
            You will be redirected to <strong>{{ redirectTarget() }}</strong> after sign in.
          </p>
        }

        <a class="login-page__cta" routerLink="/">Return home</a>
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

      .login-page__form {
        margin-top: 1.4rem;
        display: grid;
        gap: 0.95rem;
        max-width: 28rem;
      }

      .login-page__field {
        display: grid;
        gap: 0.45rem;
      }

      .login-page__field span {
        font-size: 0.82rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--lab-ink-soft);
        font-weight: 700;
      }

      .login-page__field input {
        border-radius: 0.8rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        color: var(--lab-ink);
        min-height: 2.75rem;
        padding: 0.65rem 0.9rem;
        font: inherit;
      }

      .login-page__field input:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--lab-color-primary) 36%, transparent);
        outline-offset: 2px;
      }

      .login-page__submit {
        margin-top: 1.4rem;
        border-radius: 999px;
        border: 1px solid transparent;
        background: var(--lab-color-primary);
        color: var(--lab-on-primary);
        text-decoration: none;
        font-weight: 700;
        padding: 0.75rem 1.15rem;
        cursor: pointer;
      }

      .login-page__submit:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .login-page__error {
        margin: 0;
        color: #a91b1b;
        font-weight: 600;
      }

      .login-page__hint {
        margin: 0.85rem 0 0;
        color: var(--lab-ink-soft);
        font-size: var(--lab-text-sm);
      }

      .login-page__target {
        margin: 0.65rem 0 0;
        color: var(--lab-ink-soft);
      }

      .login-page__cta {
        display: inline-block;
        margin-top: 1rem;
        border-radius: 999px;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        color: var(--lab-ink);
        text-decoration: none;
        font-weight: 600;
        padding: 0.7rem 1.1rem;
      }

      @media (max-width: 768px) {
        .login-page__inner {
          width: min(960px, calc(100% - 1.25rem));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);

  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);

  readonly errorMessage = signal<string | null>(null);

  readonly redirectTarget = signal(this.readRedirectTarget());

  email = '';

  password = '';

  async submit(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const didLogin = await this.authService.login(this.email, this.password);
    this.isSubmitting.set(false);

    if (!didLogin) {
      this.errorMessage.set('Invalid credentials. Access is limited to approved users.');
      return;
    }

    const redirectTarget = this.redirectTarget() || '/dashboard';
    void this.router.navigateByUrl(redirectTarget);
  }

  private readRedirectTarget(): string | null {
    const redirectTo = this.activatedRoute.snapshot.queryParamMap.get('redirectTo');

    if (!redirectTo?.startsWith('/')) {
      return null;
    }

    return redirectTo;
  }
}
