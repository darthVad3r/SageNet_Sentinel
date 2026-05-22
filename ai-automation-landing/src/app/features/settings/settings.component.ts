import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class SettingsComponent {}
