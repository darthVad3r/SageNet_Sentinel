import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

type NavigationItem = {
  label: string;
  path: string;
};

@Component({
  selector: 'app-core-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-shell" [class.app-shell--sidebar-open]="isSidebarOpen">
      <header class="app-shell__header">
        <button
          type="button"
          class="app-shell__menu-toggle"
          [attr.aria-expanded]="isSidebarOpen"
          aria-controls="app-shell-sidebar"
          aria-label="Toggle navigation"
          (click)="toggleSidebar()"
        >
          Menu
        </button>
        <a class="app-shell__brand" routerLink="/dashboard" (click)="closeSidebar()">
          <span class="app-shell__brand-badge" aria-hidden="true">A</span>
          <span class="app-shell__brand-copy">
            <strong>AI Automation Lab</strong>
            <span>Core application shell</span>
          </span>
        </a>
      </header>

      <div class="app-shell__layout">
        <aside
          id="app-shell-sidebar"
          class="app-shell__sidebar"
          [attr.aria-label]="'Primary navigation'"
        >
          <nav class="app-shell__nav" aria-label="Primary">
            @for (item of navigationItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="is-active"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeSidebar()"
              >
                {{ item.label }}
              </a>
            }
          </nav>
        </aside>

        <main class="app-shell__content" id="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <button
        type="button"
        class="app-shell__backdrop"
        aria-label="Close navigation"
        (click)="closeSidebar()"
      ></button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .app-shell {
        min-height: 100dvh;
        background: var(--lab-bg);
        color: var(--lab-ink);
      }

      .app-shell__header {
        position: sticky;
        top: 0;
        z-index: 30;
        min-height: 4rem;
        padding: 0 var(--lab-space-4);
        display: flex;
        align-items: center;
        gap: var(--lab-space-3);
        border-bottom: 1px solid var(--lab-line);
        background: var(--lab-surface);
      }

      .app-shell__menu-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.25rem;
        padding: 0 var(--lab-space-3);
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface);
        color: var(--lab-ink);
        font-weight: 600;
        cursor: pointer;
      }

      .app-shell__brand {
        display: inline-flex;
        align-items: center;
        gap: var(--lab-space-3);
        color: inherit;
      }

      .app-shell__brand-badge {
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        border-radius: var(--lab-radius-md);
        background: linear-gradient(135deg, var(--lab-color-primary), var(--lab-color-accent-cyan));
        color: var(--lab-on-primary);
        font-weight: 700;
      }

      .app-shell__brand-copy {
        display: grid;
        gap: 2px;
      }

      .app-shell__brand-copy strong {
        font-size: var(--lab-text-sm);
        line-height: 1.2;
      }

      .app-shell__brand-copy span {
        font-size: var(--lab-text-xs);
        color: var(--lab-ink-soft);
      }

      .app-shell__layout {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        min-height: calc(100dvh - 4rem);
      }

      .app-shell__sidebar {
        border-right: 1px solid var(--lab-line);
        background: var(--lab-surface);
        padding: var(--lab-space-4);
      }

      .app-shell__nav {
        display: grid;
        gap: var(--lab-space-2);
      }

      .app-shell__nav a {
        display: inline-flex;
        align-items: center;
        min-height: 2.5rem;
        padding: 0 var(--lab-space-3);
        border-radius: var(--lab-radius-md);
        color: var(--lab-ink-soft);
        font-weight: 600;
      }

      .app-shell__nav a:hover,
      .app-shell__nav a.is-active {
        background: color-mix(in srgb, var(--lab-color-primary) 14%, var(--lab-surface));
        color: var(--lab-color-primary-strong);
      }

      .app-shell__content {
        min-width: 0;
        padding: var(--lab-space-6);
      }

      .app-shell__backdrop {
        display: none;
      }

      @media (max-width: 900px) {
        .app-shell__layout {
          grid-template-columns: 1fr;
        }

        .app-shell__sidebar {
          position: fixed;
          top: 4rem;
          left: 0;
          bottom: 0;
          width: min(80vw, 280px);
          transform: translateX(-105%);
          transition: transform 0.2s ease;
          z-index: 35;
          box-shadow: var(--lab-shadow-2);
        }

        .app-shell--sidebar-open .app-shell__sidebar {
          transform: translateX(0);
        }

        .app-shell__content {
          padding: var(--lab-space-4);
        }

        .app-shell__backdrop {
          position: fixed;
          inset: 4rem 0 0;
          border: none;
          padding: 0;
          margin: 0;
          background: rgba(2, 8, 20, 0.45);
          z-index: 34;
          display: none;
        }

        .app-shell--sidebar-open .app-shell__backdrop {
          display: block;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  isSidebarOpen = false;

  readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Workflows', path: '/workflows' },
    { label: 'Agents', path: '/agents' },
    { label: 'Kits', path: '/kits' },
    { label: 'Settings', path: '/settings' },
  ];

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
