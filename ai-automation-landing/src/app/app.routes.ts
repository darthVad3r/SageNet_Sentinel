import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'AI Automation & Agent Workflow | Landing',
    loadComponent: () =>
      import('./features/landing/landing-page.component').then(
        (m) => m.LandingPageComponent
      )
  },
  {
    path: 'book',
    title: 'Book a Call | AI Automation',
    loadComponent: () =>
      import('./features/book/book-page.component').then(
        (m) => m.BookPageComponent
      )
  },
  {
    path: 'kit',
    title: 'AI Agent Starter Kit | Checkout',
    loadComponent: () =>
      import('./features/kit/kit-page.component').then(
        (m) => m.KitPageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
