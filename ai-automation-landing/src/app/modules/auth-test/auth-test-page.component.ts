import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '@core/services/auth.service';
import { AppStore } from '../../state/app.store';

@Component({
  selector: 'app-auth-test-page',
  standalone: true,
  imports: [],
  template: `
    <section class="auth-test">
      <div class="auth-test__inner">
        <p class="auth-test__eyebrow">Authentication provider verification</p>
        <h1>Auth test</h1>
        <p class="auth-test__message">
          This route confirms the provider was initialized at app startup and that the current
          session is available globally.
        </p>

        <dl class="auth-test__summary">
          <div>
            <dt>Provider configured</dt>
            <dd>{{ authService.isConfigured() ? 'Yes' : 'No' }}</dd>
          </div>
          <div>
            <dt>Session initialized</dt>
            <dd>{{ authService.isInitialized() ? 'Yes' : 'No' }}</dd>
          </div>
          <div>
            <dt>User email</dt>
            <dd>{{ store.user().email ?? 'Unavailable' }}</dd>
          </div>
          <div>
            <dt>Display name</dt>
            <dd>{{ store.user().name ?? 'Unavailable' }}</dd>
          </div>
          <div>
            <dt>Avatar URL</dt>
            <dd>{{ store.user().avatarUrl ?? 'Unavailable' }}</dd>
          </div>
        </dl>

        <div class="auth-test__panel">
          <h2>Provider details</h2>
          <ul class="auth-test__details">
            <li><strong>Provider:</strong> Supabase</li>
            <li><strong>SDK loaded:</strong> Yes</li>
            <li>
              <strong>Session persisted:</strong> {{ authService.isInitialized() ? 'Yes' : 'No' }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .auth-test {
        padding: 3rem 0;
      }

      .auth-test__inner {
        width: min(960px, calc(100% - 2rem));
        margin: 0 auto;
        padding: clamp(1.5rem, 3vw, 2.5rem);
        border-radius: 1.6rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        box-shadow: var(--lab-shadow-2);
      }

      .auth-test__eyebrow,
      h1,
      .auth-test__message,
      h2,
      pre {
        margin: 0;
      }

      .auth-test__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--lab-color-primary-strong);
      }

      h1 {
        margin-top: 0.8rem;
        font-size: clamp(2rem, 4vw, 3rem);
      }

      .auth-test__message {
        margin-top: 1rem;
        color: var(--lab-ink-soft);
        max-width: 58ch;
        line-height: 1.7;
      }

      .auth-test__summary {
        margin: 1.5rem 0 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }

      .auth-test__summary div {
        padding: 1rem;
        border-radius: 1rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface-overlay);
      }

      .auth-test__summary dt {
        color: var(--lab-ink-soft);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .auth-test__summary dd {
        margin: 0.45rem 0 0;
        font-weight: 700;
      }

      .auth-test__panel {
        margin-top: 1.5rem;
      }

      .auth-test__panel h2 {
        margin-bottom: 0.75rem;
        font-size: 1rem;
      }

      .auth-test__panel ul {
        margin: 0;
        padding: 0 0 0 1.5rem;
      }

      .auth-test__details li {
        margin: 0.5rem 0;
        line-height: 1.6;
      }

      .auth-test__details strong {
        font-weight: 700;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthTestPageComponent {
  readonly authService = inject(AuthService);

  readonly store = inject(AppStore);
}
