import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppTheme } from '@app/state/app.state';
import { AppStore } from '@app/state/app.store';

/**
 * Dashboard Component
 * Main dashboard feature page
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to the Dashboard. This feature now reads and updates global app state.</p>
        </div>

        <div class="dashboard-actions">
          <button type="button" class="action-button" (click)="toggleSidebar()">
            {{ store.sidebarOpen() ? 'Close Sidebar' : 'Open Sidebar' }}
          </button>
          <button type="button" class="action-button" (click)="toggleTheme()">
            Theme: {{ store.theme() }} → {{ nextTheme() }}
          </button>
          <button type="button" class="action-button" (click)="toggleLoading()">
            {{ store.isLoading() ? 'Stop Loading' : 'Start Loading' }}
          </button>
        </div>
      </div>

      <section class="state-panel" aria-label="Global application state">
        <div class="state-panel__card">
          <h2>Global State Snapshot</h2>
          <dl>
            <div>
              <dt>Theme</dt>
              <dd>{{ store.theme() }}</dd>
            </div>
            <div>
              <dt>Sidebar</dt>
              <dd>{{ store.sidebarOpen() ? 'Open' : 'Closed' }}</dd>
            </div>
            <div>
              <dt>Authenticated</dt>
              <dd>{{ store.isAuthenticated() ? 'Yes' : 'No' }}</dd>
            </div>
            <div>
              <dt>User</dt>
              <dd>{{ store.user().name ?? 'Anonymous' }}</dd>
            </div>
            <div>
              <dt>Loading</dt>
              <dd>{{ store.isLoading() ? 'Active' : 'Idle' }}</dd>
            </div>
            <div>
              <dt>Unread Notifications</dt>
              <dd>{{ store.unreadNotificationsCount() }}</dd>
            </div>
          </dl>

          <div class="state-panel__actions">
            <button type="button" class="action-button action-button--primary" (click)="seedDemo()">
              Seed Demo Session
            </button>
            <button
              type="button"
              class="action-button"
              (click)="clearNotifications()"
              [disabled]="!store.notifications().length"
            >
              Clear Notifications
            </button>
          </div>

          <p class="state-panel__message">{{ store.activeNotificationMessage() }}</p>
        </div>
      </section>

      <section class="dashboard-grid">
        <div class="card">
          <h2>Workflows</h2>
          <p>View your active workflows and automation status.</p>
        </div>
        <div class="card">
          <h2>Metrics</h2>
          <p>Track performance and key metrics.</p>
        </div>
        <div class="card">
          <h2>Alerts</h2>
          <p>System alerts and notifications.</p>
        </div>
        <div class="card">
          <h2>Recent Activity</h2>
          <p>Latest changes and activities.</p>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .dashboard-actions,
      .state-panel__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .action-button {
        border: 1px solid var(--lab-line);
        background: var(--lab-surface-strong);
        border-radius: 999px;
        padding: 0.7rem 1rem;
        font-weight: 600;
        color: var(--lab-ink);
        cursor: pointer;
      }

      .action-button:hover {
        border-color: var(--lab-accent);
        color: var(--lab-accent);
      }

      .action-button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .action-button--primary {
        background: var(--lab-accent);
        border-color: var(--lab-accent);
        color: var(--lab-surface-strong);
      }

      .state-panel {
        margin-bottom: 2rem;
      }

      .state-panel__card {
        padding: 1.5rem;
        border: 1px solid var(--lab-line);
        border-radius: 12px;
        background: var(--lab-surface-strong);
        box-shadow: var(--lab-shadow);
      }

      .state-panel__card h2 {
        margin-top: 0;
      }

      dl {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin: 0 0 1.5rem;
      }

      dl div {
        padding: 0.85rem 1rem;
        border-radius: 10px;
        background: var(--lab-surface);
      }

      dt {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--lab-ink-soft);
        margin-bottom: 0.35rem;
      }

      dd {
        margin: 0;
        font-weight: 600;
        color: var(--lab-ink);
      }

      .state-panel__message {
        margin: 1rem 0 0;
        color: var(--lab-accent);
        font-weight: 600;
      }

      h1 {
        margin-bottom: 1rem;
        font-size: 2rem;
      }

      p {
        color: var(--lab-ink-soft);
        margin-bottom: 2rem;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .card {
        padding: 1.5rem;
        border: 1px solid var(--lab-line);
        border-radius: 8px;
        background: var(--lab-surface);
        transition: box-shadow 0.2s ease;
      }

      .card:hover {
        box-shadow: var(--lab-shadow);
      }

      .card h2 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
      }

      .card p {
        margin: 0;
        font-size: 0.95rem;
      }

      @media (max-width: 900px) {
        .dashboard-header {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  readonly store: AppStore = inject(AppStore);

  private readonly themeOrder: AppTheme[] = ['light', 'dark', 'system'];

  toggleSidebar(): void {
    this.store.toggleSidebar();
  }

  toggleTheme(): void {
    this.store.setTheme(this.nextTheme());
  }

  nextTheme(): AppTheme {
    return this.getNextTheme(this.store.theme());
  }

  private getNextTheme(currentTheme: AppTheme): AppTheme {
    const currentIndex = this.themeOrder.indexOf(currentTheme);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % this.themeOrder.length;
    return this.themeOrder[nextIndex];
  }

  toggleLoading(): void {
    this.store.setLoading(!this.store.isLoading());
  }

  seedDemo(): void {
    this.store.seedDashboardDemo();
  }

  clearNotifications(): void {
    this.store.clearNotifications();
  }
}
