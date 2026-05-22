import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { SeoMetadata } from './core/services/seo.service';
import { AppShellComponent } from './layout/shell/app-shell.component';

const dashboardSeo: SeoMetadata = {
  title: 'Dashboard | AI Automation Lab',
  description: 'Track AI operations, workflow health, and delivery metrics.',
  canonicalUrl: 'https://example.com/dashboard',
};

const workflowsSeo: SeoMetadata = {
  title: 'Workflows | AI Automation Lab',
  description: 'Manage and monitor automation workflow execution.',
  canonicalUrl: 'https://example.com/workflows',
};

const agentsSeo: SeoMetadata = {
  title: 'Agents | AI Automation Lab',
  description: 'Manage agent definitions, runtime behavior, and policy controls.',
  canonicalUrl: 'https://example.com/agents',
};

const kitsSeo: SeoMetadata = {
  title: 'Kits | AI Automation Lab',
  description: 'Review reusable implementation kits and versioned delivery assets.',
  canonicalUrl: 'https://example.com/kits',
};

const settingsSeo: SeoMetadata = {
  title: 'Settings | AI Automation Lab',
  description: 'Configure preferences, integrations, and environment options.',
  canonicalUrl: 'https://example.com/settings',
};

const landingSeo: SeoMetadata = {
  title: 'Landing | AI Automation Lab',
  description: 'Explore the public landing page and productized offerings.',
  canonicalUrl: 'https://example.com/landing',
};

const bookSeo: SeoMetadata = {
  title: 'Book | AI Automation Lab',
  description: 'Schedule strategy sessions and architecture advisory calls.',
  canonicalUrl: 'https://example.com/book',
};

const loginSeo: SeoMetadata = {
  title: 'Login | AI Automation Lab',
  description: 'Sign in to access protected AI Automation Lab features.',
  canonicalUrl: 'https://example.com/login',
};

const notFoundSeo: SeoMetadata = {
  title: '404 | AI Automation Lab',
  description: 'The requested page could not be found.',
  canonicalUrl: 'https://example.com/not-found',
};

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'landing',
      },
      {
        path: 'dashboard',
        title: dashboardSeo.title,
        data: { seo: dashboardSeo },
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'workflows',
        title: workflowsSeo.title,
        data: { seo: workflowsSeo },
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/workflows/workflows.component').then((m) => m.WorkflowsComponent),
      },
      {
        path: 'agents',
        title: agentsSeo.title,
        data: { seo: agentsSeo },
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/agents/agents.component').then((m) => m.AgentsComponent),
      },
      {
        path: 'kits',
        title: kitsSeo.title,
        data: { seo: kitsSeo },
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/kits/kits.component').then((m) => m.KitsComponent),
      },
      {
        path: 'settings',
        title: settingsSeo.title,
        data: { seo: settingsSeo },
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'landing',
        title: landingSeo.title,
        data: { seo: landingSeo },
        loadComponent: () =>
          import('./modules/landing/landing-page.component').then((m) => m.LandingPageComponent),
      },
      {
        path: 'book',
        title: bookSeo.title,
        data: { seo: bookSeo },
        loadComponent: () =>
          import('./modules/book/book-page.component').then((m) => m.BookPageComponent),
      },
      {
        path: 'kit',
        pathMatch: 'full',
        redirectTo: 'kits',
      },
      {
        path: 'login',
        title: loginSeo.title,
        data: { seo: loginSeo },
        loadComponent: () =>
          import('./modules/login/login-page.component').then((m) => m.LoginPageComponent),
      },
      {
        path: 'not-found',
        title: notFoundSeo.title,
        data: { seo: notFoundSeo },
        loadComponent: () =>
          import('./modules/not-found/not-found-page.component').then(
            (m) => m.NotFoundPageComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ],
  },
];
