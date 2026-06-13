import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { type LeadSubmission } from '@core/services/lead-contract';
import { LeadIntakeService } from '@core/services/lead-intake.service';

/**
 * Settings Component
 * Application settings and configuration feature
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="settings-container">
      <h1>Settings</h1>
      <p>Configure your application preferences and account settings.</p>

      <div class="settings-layout">
        <aside class="settings-sidebar">
          <nav class="settings-nav">
            <button type="button" class="nav-item active" aria-current="page">Account</button>
            <button type="button" class="nav-item">Preferences</button>
            <button type="button" class="nav-item">Notifications</button>
            <button type="button" class="nav-item">Integrations</button>
            <button type="button" class="nav-item">API Keys</button>
            <button type="button" class="nav-item">Billing</button>
          </nav>
        </aside>

        <main class="settings-content">
          <section class="settings-section">
            <h2>Account Settings</h2>
            <div class="settings-group">
              <label for="settings-email">Email Address</label>
              <input id="settings-email" type="email" value="user@example.com" />
            </div>
            <div class="settings-group">
              <label for="settings-full-name">Full Name</label>
              <input id="settings-full-name" type="text" value="John Doe" />
            </div>
            <div class="settings-group">
              <label for="settings-organization">Organization</label>
              <input id="settings-organization" type="text" value="AI Automation Lab" />
            </div>
            <button class="btn btn-primary">Save Changes</button>
          </section>

          <section class="settings-section">
            <h2>Security</h2>
            <div class="settings-group">
              <span class="settings-label">Password</span>
              <button id="settings-change-password" class="btn btn-secondary">
                Change Password
              </button>
            </div>
            <div class="settings-group">
              <span class="settings-label">Two-Factor Authentication</span>
              <button id="settings-enable-2fa" class="btn btn-secondary">Enable 2FA</button>
            </div>
          </section>

          <section class="settings-section">
            <h2>Lead Intake Export</h2>
            <p class="settings-section-copy">
              Recent booking submissions are loaded from the /api/leads contract so source and UTM
              metadata can be reviewed from the same backend path used in production.
            </p>

            @if (isLoading()) {
              <p class="settings-empty-state">Loading recent lead submissions...</p>
            } @else if (loadError(); as errorMessage) {
              <p class="settings-empty-state">{{ errorMessage }}</p>
              <button type="button" class="btn btn-secondary" (click)="refreshLeadSubmissions()">
                Retry
              </button>
            } @else if (recentLeadSubmissions().length) {
              <div class="lead-export-actions">
                <button type="button" class="btn btn-secondary" (click)="downloadLeadExport()">
                  Download JSON export
                </button>
              </div>

              <div class="lead-export-table-wrap">
                <table class="lead-export-table">
                  <thead>
                    <tr>
                      <th scope="col">Submitted</th>
                      <th scope="col">Lead</th>
                      <th scope="col">Company</th>
                      <th scope="col">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (submission of recentLeadSubmissions(); track submission.id) {
                      <tr>
                        <td>{{ formatSubmittedAt(submission) }}</td>
                        <td>
                          {{ submission.name }}<br /><span>{{ submission.email }}</span>
                        </td>
                        <td>{{ submission.company }}</td>
                        <td>{{ formatSource(submission) }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="settings-empty-state">
                No lead submissions have been captured yet. New intake entries from the booking page
                will appear here with route and UTM source metadata.
              </p>
            }
          </section>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        margin-bottom: 1rem;
        font-size: 2rem;
      }

      h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid var(--lab-line);
        padding-bottom: 1rem;
      }

      p {
        color: var(--lab-ink-soft);
        margin-bottom: 2rem;
      }

      .settings-layout {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 2rem;
      }

      .settings-sidebar {
        background: var(--lab-surface);
        border-radius: 8px;
        padding: 1rem;
        height: fit-content;
      }

      .settings-nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .nav-item {
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 4px;
        background: transparent;
        text-align: left;
        color: var(--lab-ink);
        transition: background-color 0.2s ease;
        display: block;
        width: 100%;
        cursor: pointer;
      }

      .nav-item:hover,
      .nav-item.active {
        background-color: color-mix(in srgb, var(--lab-color-primary) 12%, transparent);
        color: var(--lab-color-primary);
        font-weight: 600;
      }

      .settings-content {
        background: var(--lab-surface);
        border: 1px solid var(--lab-line);
        border-radius: 8px;
        padding: 2rem;
      }

      .settings-section {
        margin-bottom: 2rem;
      }

      .settings-section:last-child {
        margin-bottom: 0;
      }

      .settings-section-copy,
      .settings-empty-state {
        color: var(--lab-ink-soft);
      }

      .settings-group {
        margin-bottom: 1.5rem;
      }

      .settings-group label,
      .settings-group .settings-label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .settings-group input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--lab-line);
        border-radius: 4px;
        font-size: 1rem;
      }

      .lead-export-actions {
        margin-bottom: 1rem;
      }

      .lead-export-table-wrap {
        overflow-x: auto;
      }

      .lead-export-table {
        width: 100%;
        border-collapse: collapse;
      }

      .lead-export-table th,
      .lead-export-table td {
        padding: 0.8rem;
        text-align: left;
        border-bottom: 1px solid var(--lab-line);
        vertical-align: top;
      }

      .lead-export-table td span {
        color: var(--lab-ink-soft);
      }

      @media (max-width: 768px) {
        .settings-layout {
          grid-template-columns: 1fr;
        }

        .settings-sidebar {
          display: flex;
        }

        .settings-nav {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .nav-item {
          flex: 1;
          min-width: 150px;
        }
      }
    `,
  ],
})
export class SettingsComponent {
  private readonly leadIntakeService = inject(LeadIntakeService);

  private readonly loadErrorState = signal<string | null>(null);

  readonly recentLeadSubmissions = computed(() => this.leadIntakeService.submissions().slice(0, 5));

  readonly isLoading = this.leadIntakeService.isLoading;

  readonly loadError = this.loadErrorState.asReadonly();

  constructor() {
    queueMicrotask(() => {
      void this.refreshLeadSubmissions();
    });
  }

  downloadLeadExport(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const blob = new Blob(
      [this.leadIntakeService.exportSubmissions(this.recentLeadSubmissions())],
      {
        type: 'application/json;charset=utf-8',
      }
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'lead-intake-export.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  formatSubmittedAt(submission: LeadSubmission): string {
    return new Date(submission.submittedAt).toLocaleString();
  }

  formatSource(submission: LeadSubmission): string {
    const source = submission.source.utm.source;
    const campaign = submission.source.utm.campaign;

    if (source && campaign) {
      return `${submission.source.route} · ${source} / ${campaign}`;
    }

    if (source) {
      return `${submission.source.route} · ${source}`;
    }

    return submission.source.route;
  }

  async refreshLeadSubmissions(): Promise<void> {
    this.loadErrorState.set(null);

    try {
      await this.leadIntakeService.loadSubmissions(5);
    } catch {
      this.loadErrorState.set('We could not load lead submissions from /api/leads.');
    }
  }
}
