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
import { SeoMetadata, SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-site-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">
      <header class="shell__header">
        <div class="shell__header-inner">
          <a routerLink="/" class="brand" aria-label="AI Automation Lab home">
            <span class="brand__badge">A</span>
            <span class="brand__copy">
              <strong>AI Automation Lab</strong>
              <span>Angular landing scaffold for automation offers</span>
            </span>
          </a>

          <nav class="nav" aria-label="Primary">
            <a
              routerLink="/"
              routerLinkActive="is-active"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Home
            </a>
            <a routerLink="/book" routerLinkActive="is-active">Book</a>
            <a routerLink="/kit" routerLinkActive="is-active">Kit</a>
            <a routerLink="/dashboard" routerLinkActive="is-active">Dashboard</a>
            <a routerLink="/workflows" routerLinkActive="is-active">Workflows</a>
            <a routerLink="/settings" routerLinkActive="is-active">Settings</a>
          </nav>
        </div>
      </header>

      <main class="shell__content">
        <router-outlet></router-outlet>
      </main>

      <footer class="shell__footer">
        <div class="shell__footer-inner">
          <p>Reusable Angular modules, shared UI, and route-level SEO.</p>
          <a routerLink="/book">Start a project</a>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .shell {
        min-height: 100dvh;
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .shell__header {
        position: sticky;
        top: 0;
        z-index: 30;
        backdrop-filter: blur(18px);
        background: var(--lab-surface-overlay);
        border-bottom: 1px solid var(--lab-line);
      }

      .shell__header-inner,
      .shell__footer-inner {
        width: min(1120px, calc(100% - 2rem));
        margin: 0 auto;
      }

      .shell__header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-height: 4.5rem;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 0.85rem;
        text-decoration: none;
      }

      .brand__badge {
        width: 2.5rem;
        height: 2.5rem;
        display: grid;
        place-items: center;
        border-radius: 0.9rem;
        background: linear-gradient(135deg, var(--lab-color-primary), var(--lab-color-accent-cyan));
        color: var(--lab-on-primary);
        font-weight: 800;
      }

      .brand__copy {
        display: grid;
        gap: 0.1rem;
      }

      .brand__copy strong {
        font-size: 0.98rem;
      }

      .brand__copy span {
        color: var(--lab-ink-soft);
        font-size: 0.8rem;
      }

      .nav {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        flex-wrap: wrap;
      }

      .nav a {
        padding: 0.7rem 0.95rem;
        border-radius: 999px;
        text-decoration: none;
        color: var(--lab-ink-soft);
        font-weight: 600;
        transition:
          background-color 0.2s ease,
          color 0.2s ease;
      }

      .nav a:hover,
      .nav a.is-active {
        background: var(--lab-surface-overlay);
        color: var(--lab-color-primary-strong);
      }

      .shell__footer {
        padding: 1.5rem 0 2rem;
      }

      .shell__footer-inner {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--lab-line);
        color: var(--lab-ink-soft);
      }

      .shell__footer-inner p {
        margin: 0;
      }

      .shell__footer-inner a {
        color: var(--lab-color-primary-strong);
        font-weight: 700;
        text-decoration: none;
      }

      @media (max-width: 768px) {
        .shell__header-inner,
        .shell__footer-inner {
          width: min(1120px, calc(100% - 1.25rem));
          flex-direction: column;
          align-items: stretch;
        }

        .nav {
          justify-content: space-between;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteShellComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly seoService = inject(SeoService);

  private readonly destroyRef = inject(DestroyRef);

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
}
