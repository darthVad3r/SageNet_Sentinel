import { Routes } from '@angular/router';
import { routes } from './app.routes';
import { AgentsComponent } from './features/agents/agents.component';

describe('routes', () => {
  it('should redirect empty child path to dashboard', () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children as Routes | undefined;
    const defaultChildRoute = childRoutes?.find((route) => route.path === '');

    expect(defaultChildRoute).toBeDefined();
    expect(defaultChildRoute?.redirectTo).toBe('dashboard');
    expect(defaultChildRoute?.pathMatch).toBe('full');
  });

  it('should lazy-load agents route component', async () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children as Routes | undefined;
    const agentsRoute = childRoutes?.find((route) => route.path === 'agents');

    expect(agentsRoute).toBeDefined();

    const loadedComponent = await agentsRoute?.loadComponent?.();

    expect(loadedComponent).toBe(AgentsComponent);
  });

  it('should redirect wildcard child route to dashboard', () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children as Routes | undefined;
    const wildcardRoute = childRoutes?.find((route) => route.path === '**');

    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('dashboard');
  });
});
