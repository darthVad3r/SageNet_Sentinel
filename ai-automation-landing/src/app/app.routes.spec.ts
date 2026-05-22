import { routes } from './app.routes';
import { AgentsComponent } from './features/agents/agents.component';
import { LoginPageComponent } from './modules/login/login-page.component';

describe('routes', () => {
  it('should redirect empty child path to landing', () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const defaultChildRoute = childRoutes?.find((route) => route.path === '');

    expect(defaultChildRoute).toBeDefined();
    expect(defaultChildRoute?.redirectTo).toBe('landing');
    expect(defaultChildRoute?.pathMatch).toBe('full');
  });

  it('should lazy-load agents route component', async () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const agentsRoute = childRoutes?.find((route) => route.path === 'agents');

    expect(agentsRoute).toBeDefined();

    const loadedComponent = await agentsRoute?.loadComponent?.();

    expect(loadedComponent).toBe(AgentsComponent);
  });

  it('should keep login child route mapped to dedicated login component', async () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const loginRoute = childRoutes?.find((route) => route.path === 'login');

    expect(loginRoute).toBeDefined();

    const loadedComponent = await loginRoute?.loadComponent?.();

    expect(loadedComponent).toBe(LoginPageComponent);
  });

  it('should redirect legacy /kit path to /kits using full path match', () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const legacyKitRoute = childRoutes?.find((route) => route.path === 'kit');

    expect(legacyKitRoute).toBeDefined();
    expect(legacyKitRoute?.redirectTo).toBe('kits');
    expect(legacyKitRoute?.pathMatch).toBe('full');
  });

  it('should redirect wildcard child route to not-found', () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const wildcardRoute = childRoutes?.find((route) => route.path === '**');

    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('not-found');
  });
});
