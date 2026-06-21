import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { OnboardingGuideService } from '../../core/services/onboarding-guide.service';
import { SeoMetadata, SeoService } from '../../core/services/seo.service';
import { AppStore } from '../../state/app.store';

type NavigationItem = {
  label: string;
  path: string;
};

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-shell" [class.app-shell--sidebar-open]="store.sidebarOpen()">
      <header class="app-shell__header">
        <button
          type="button"
          class="app-shell__menu-toggle"
          [attr.aria-expanded]="store.sidebarOpen()"
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

        <details class="app-shell__help-menu">
          <summary>Help</summary>
          <div class="app-shell__help-panel">
            <button
              type="button"
              [disabled]="!store.hasActiveSession()"
              (click)="reopenOnboardingGuide($event)"
            >
              Re-open onboarding guide
            </button>
          </div>
        </details>
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

      .app-shell__help-menu {
        margin-left: auto;
        position: relative;
      }

      .app-shell__help-menu summary {
        list-style: none;
        display: inline-flex;
        align-items: center;
        min-height: 2.25rem;
        padding: 0 var(--lab-space-3);
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface);
        color: var(--lab-ink);
        font-weight: 600;
        cursor: pointer;
      }

      .app-shell__help-menu summary::-webkit-details-marker {
        display: none;
      }

      .app-shell__help-panel {
        position: absolute;
        top: calc(100% + var(--lab-space-2));
        right: 0;
        min-width: 220px;
        padding: var(--lab-space-2);
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface);
        box-shadow: var(--lab-shadow-2);
        z-index: 40;
      }

      .app-shell__help-panel button {
        width: 100%;
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface);
        color: var(--lab-ink);
        padding: var(--lab-space-2) var(--lab-space-3);
        text-align: left;
        cursor: pointer;
      }

      .app-shell__help-panel button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .app-shell__menu-toggle {
        display: none;
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

      @media (max-width: 1024px) {
        .app-shell__menu-toggle {
          display: inline-flex;
        }

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
export class AppShellComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly seoService = inject(SeoService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly onboardingGuide = inject(OnboardingGuideService);

  readonly store = inject(AppStore);

  readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Workflows', path: '/workflows' },
    { label: 'Agents', path: '/agents' },
    { label: 'Kits', path: '/kits' },
    { label: 'Settings', path: '/settings' },
  ];

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef),
        map(() => {
          let route = this.activatedRoute;

          while (route.firstChild) {
            route = route.firstChild;
          }

          return route.snapshot.data['seo'] as SeoMetadata | undefined;
        })
      )
      .subscribe((metadata) => {
        if (metadata) {
          this.seoService.applyMetadata(metadata);
        }
      });
  }

  toggleSidebar(): void {
    this.store.toggleSidebar();
  }

  closeSidebar(): void {
    this.store.setSidebarOpen(false);
  }

  reopenOnboardingGuide(event: Event): void {
    this.onboardingGuide.reopenGuide();

    const trigger = event.currentTarget as HTMLElement | null;
    const detailsElement = trigger?.closest('details');
    detailsElement?.removeAttribute('open');
  }
}
