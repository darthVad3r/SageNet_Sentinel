import { Routes } from '@angular/router';
import { SeoMetadata } from '@core/services/seo.service';
import { canActivateAuthGuard } from './core/guards/auth.guard';

const homeSeo: SeoMetadata = {
  title: 'AI Automation Lab | Agent Workflow Architecture',
  description:
    'AI Automation Lab builds practical agent workflows, automation systems, and starter kits for teams shipping AI operations.',
  canonicalUrl: 'https://example.com/',
  structuredData: [
    {
      id: 'organization',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'AI Automation Lab',
        url: 'https://example.com/',
        description:
          'AI Automation Lab builds practical agent workflows, automation systems, and starter kits for teams shipping AI operations.',
        sameAs: [],
      },
    },
    {
      id: 'service',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'AI Workflow Architecture',
        serviceType: 'AI Automation Consulting',
        provider: {
          '@type': 'Organization',
          name: 'AI Automation Lab',
        },
        areaServed: 'Global',
        url: 'https://example.com/',
      },
    },
    {
      id: 'website',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AI Automation Lab',
        url: 'https://example.com/',
      },
    },
  ],
};

const bookSeo: SeoMetadata = {
  title: 'Book a Strategy Call | AI Automation Lab',
  description:
    'Schedule a strategy session to map AI automations, delivery priorities, and agent workflow opportunities for your team.',
  canonicalUrl: 'https://example.com/book',
};

const kitSeo: SeoMetadata = {
  title: 'AI Agent Starter Kit | AI Automation Lab',
  description:
    'Review the AI Agent Starter Kit for templates, delivery assets, and a reusable architecture scaffold for workflow-driven AI products.',
  canonicalUrl: 'https://example.com/kit',
  structuredData: [
    {
      id: 'product',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'AI Agent Starter Kit',
        description:
          'Starter package with reusable AI agent templates, workflow assets, and implementation guidance.',
        brand: {
          '@type': 'Brand',
          name: 'AI Automation Lab',
        },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'USD',
          url: 'https://example.com/kit',
        },
      },
    },
  ],
};

const loginSeo: SeoMetadata = {
  title: 'Login | AI Automation Lab',
  description:
    'Sign in to access protected AI Automation Lab routes, workflows, and account settings.',
  canonicalUrl: 'https://example.com/login',
};

const dashboardSeo: SeoMetadata = {
  title: 'Dashboard | AI Automation Lab',
  description:
    'Track AI operations, workflow health, and delivery metrics from the AI Automation Lab dashboard.',
  canonicalUrl: 'https://example.com/dashboard',
};

const workflowsSeo: SeoMetadata = {
  title: 'Workflows | AI Automation Lab',
  description:
    'Manage and review AI workflow automations, orchestration states, and execution paths.',
  canonicalUrl: 'https://example.com/workflows',
};

const workflowBuilderSeo: SeoMetadata = {
  title: 'Workflow Builder | AI Automation Lab',
  description:
    'Draft workflow steps, review lifecycle checkpoints, and prepare automation flows for delivery.',
  canonicalUrl: 'https://example.com/workflow-builder',
};

const automationEditorSeo: SeoMetadata = {
  title: 'Automation Editor | AI Automation Lab',
  description:
    'Shape workflow steps, trigger logic, and release checks in the AI Automation Lab automation editor.',
  canonicalUrl: 'https://example.com/automation-editor',
};

const settingsSeo: SeoMetadata = {
  title: 'Settings | AI Automation Lab',
  description:
    'Configure AI Automation Lab preferences, integrations, and environment-specific options.',
  canonicalUrl: 'https://example.com/settings',
};

const authTestSeo: SeoMetadata = {
  title: 'Auth Test | AI Automation Lab',
  description:
    'Verify authenticated session metadata and provider initialization for AI Automation Lab.',
  canonicalUrl: 'https://example.com/auth-test',
};

const notFoundSeo: SeoMetadata = {
  title: '404 | AI Automation Lab',
  description:
    'The requested page could not be found. Return to AI Automation Lab to continue exploring workflows and resources.',
  canonicalUrl: 'https://example.com/404',
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@shared/layout/site-shell.component').then((m) => m.SiteShellComponent),
    children: [
      {
        path: '',
        title: homeSeo.title,
        data: { seo: homeSeo },
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
        title: kitSeo.title,
        data: { seo: kitSeo },
        loadComponent: () =>
          import('./modules/kit/kit-page.component').then((m) => m.KitPageComponent),
      },
      {
        path: 'login',
        title: loginSeo.title,
        data: { seo: loginSeo },
        loadComponent: () =>
          import('./modules/login/login-page.component').then((m) => m.LoginPageComponent),
      },
      {
        path: 'dashboard',
        title: dashboardSeo.title,
        data: { seo: dashboardSeo },
        canActivate: [canActivateAuthGuard],
        loadChildren: () =>
          import('@features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'workflows',
        title: workflowsSeo.title,
        data: { seo: workflowsSeo },
        canActivate: [canActivateAuthGuard],
        loadComponent: () =>
          import('@features/workflows/workflows.component').then((m) => m.WorkflowsComponent),
      },
      {
        path: 'workflow-builder',
        title: workflowBuilderSeo.title,
        data: { seo: workflowBuilderSeo },
        canActivate: [canActivateAuthGuard],
        loadComponent: () =>
          import('./features/workflow-builder/workflow-builder.component').then(
            (m) => m.WorkflowBuilderComponent
          ),
      },
      {
        path: 'automation-editor',
        title: automationEditorSeo.title,
        data: { seo: automationEditorSeo },
        canActivate: [canActivateAuthGuard],
        loadComponent: () =>
          import('./features/automation-editor/automation-editor.component').then(
            (m) => m.AutomationEditorComponent
          ),
      },
      {
        path: 'settings',
        title: settingsSeo.title,
        data: { seo: settingsSeo },
        canActivate: [canActivateAuthGuard],
        loadComponent: () =>
          import('@features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'auth-test',
        title: authTestSeo.title,
        data: { seo: authTestSeo },
        canActivate: [canActivateAuthGuard],
        loadComponent: () =>
          import('./modules/auth-test/auth-test-page.component').then(
            (m) => m.AuthTestPageComponent
          ),
      },
      {
        path: '**',
        title: notFoundSeo.title,
        data: { seo: notFoundSeo },
        loadComponent: () =>
          import('./modules/not-found/not-found-page.component').then(
            (m) => m.NotFoundPageComponent
          ),
      },
    ],
  },
];
