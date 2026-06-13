import { routes } from './app.routes';
import { DASHBOARD_ROUTES } from './features/dashboard/dashboard.routes';
import { AuthTestPageComponent } from './modules/auth-test/auth-test-page.component';
import { LoginPageComponent } from './modules/login/login-page.component';
import { NotFoundPageComponent } from './modules/not-found/not-found-page.component';

describe('routes', () => {
  it('should map login route to the dedicated login component', async () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const loginRoute = childRoutes?.find((route) => route.path === 'login');

    expect(loginRoute).toBeDefined();
    expect(loginRoute?.redirectTo).toBeUndefined();

    const loadedComponent = await loginRoute?.loadComponent?.();

    expect(loadedComponent).toBe(LoginPageComponent);
  });

  it('should map dashboard route to the dashboard feature routes', async () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const dashboardRoute = childRoutes?.find((route) => route.path === 'dashboard');

    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.redirectTo).toBeUndefined();

    const loadedRoutes = await dashboardRoute?.loadChildren?.();

    expect(loadedRoutes).toBe(DASHBOARD_ROUTES);
    expect(dashboardRoute?.canActivate).toHaveLength(1);
    expect(typeof dashboardRoute?.canActivate?.[0]).toBe('function');
  });

  it('should protect workflows and settings routes', () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const workflowsRoute = childRoutes?.find((route) => route.path === 'workflows');
    const settingsRoute = childRoutes?.find((route) => route.path === 'settings');
    const authTestRoute = childRoutes?.find((route) => route.path === 'auth-test');

    expect(workflowsRoute?.canActivate).toHaveLength(1);
    expect(settingsRoute?.canActivate).toHaveLength(1);
    expect(authTestRoute?.canActivate).toHaveLength(1);

    expect(typeof workflowsRoute?.canActivate?.[0]).toBe('function');
    expect(typeof settingsRoute?.canActivate?.[0]).toBe('function');
    expect(typeof authTestRoute?.canActivate?.[0]).toBe('function');
  });

  it('should map auth-test route to the dedicated auth-test component', async () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const authTestRoute = childRoutes?.find((route) => route.path === 'auth-test');

    expect(authTestRoute).toBeDefined();
    expect(authTestRoute?.redirectTo).toBeUndefined();

    const loadedComponent = await authTestRoute?.loadComponent?.();

    expect(loadedComponent).toBe(AuthTestPageComponent);
  });

  it('should map wildcard route to the dedicated not-found component', async () => {
    const shellRoute = routes.find((route) => route.path === '');
    const childRoutes = shellRoute?.children;
    const wildcardRoute = childRoutes?.find((route) => route.path === '**');

    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBeUndefined();

    const loadedComponent = await wildcardRoute?.loadComponent?.();

    expect(loadedComponent).toBe(NotFoundPageComponent);
  });
});
