import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/shell/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'workflows',
        loadComponent: () =>
          import('./features/workflows/workflows.component').then((m) => m.WorkflowsComponent),
      },
      {
        path: 'agents',
        loadComponent: () =>
          import('./features/agents/agents.component').then((m) => m.AgentsComponent),
      },
      {
        path: 'kits',
        loadComponent: () => import('./features/kits/kits.component').then((m) => m.KitsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
