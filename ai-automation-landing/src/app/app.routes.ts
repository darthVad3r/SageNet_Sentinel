import { Routes } from '@angular/router';
import { SeoMetadata } from './core/services/seo.service';
import { SiteShellComponent } from './shared/layout/site-shell.component';

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
        sameAs: []
      }
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
          name: 'AI Automation Lab'
        },
        areaServed: 'Global',
        url: 'https://example.com/'
      }
    },
    {
      id: 'website',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AI Automation Lab',
        url: 'https://example.com/'
      }
    }
  ]
};

const bookSeo: SeoMetadata = {
  title: 'Book a Strategy Call | AI Automation Lab',
  description:
    'Schedule a strategy session to map AI automations, delivery priorities, and agent workflow opportunities for your team.',
  canonicalUrl: 'https://example.com/book'
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
          name: 'AI Automation Lab'
        },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'USD',
          url: 'https://example.com/kit'
        }
      }
    }
  ]
};

export const routes: Routes = [
  {
    path: '',
    component: SiteShellComponent,
    children: [
      {
        path: '',
        title: homeSeo.title,
        data: { seo: homeSeo },
        loadComponent: () =>
          import('./modules/landing/landing-page.component').then(
            (m) => m.LandingPageComponent
          )
      },
      {
        path: 'book',
        title: bookSeo.title,
        data: { seo: bookSeo },
        loadComponent: () =>
          import('./modules/book/book-page.component').then(
            (m) => m.BookPageComponent
          )
      },
      {
        path: 'kit',
        title: kitSeo.title,
        data: { seo: kitSeo },
        loadComponent: () =>
          import('./modules/kit/kit-page.component').then(
            (m) => m.KitPageComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
