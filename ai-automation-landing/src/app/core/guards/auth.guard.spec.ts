import { Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authService: AuthService;
  let router: Router;
  let guard: AuthGuard;
  let loginUrlTree: UrlTree;
  let isAuthenticated = false;
  let isQaDemoBypassRequested = false;
  let tryEnableQaDemoSession = false;
  let tryEnableQaDemoSessionCalls = 0;
  let createUrlTreeCalls: unknown[][] = [];

  beforeEach(() => {
    isAuthenticated = false;
    isQaDemoBypassRequested = false;
    tryEnableQaDemoSession = false;
    tryEnableQaDemoSessionCalls = 0;
    createUrlTreeCalls = [];
    loginUrlTree = {} as UrlTree;

    authService = {
      isAuthenticated: () => isAuthenticated,
      isQaDemoBypassRequested: () => isQaDemoBypassRequested,
      tryEnableQaDemoSession: () => {
        tryEnableQaDemoSessionCalls += 1;
        return tryEnableQaDemoSession;
      },
    } as AuthService;

    router = {
      createUrlTree: (...commands: unknown[]) => {
        createUrlTreeCalls.push(commands);
        return loginUrlTree;
      },
    } as unknown as Router;

    guard = new AuthGuard(authService, router);
  });

  it('should allow navigation when authenticated', () => {
    isAuthenticated = true;

    const result = guard.canActivate({} as never, { url: '/dashboard' } as never);

    expect(result).toBe(true);
    expect(createUrlTreeCalls).toEqual([]);
    expect(tryEnableQaDemoSessionCalls).toBe(0);
  });

  it('should reject demo bypass outside dashboard routes', () => {
    isQaDemoBypassRequested = true;
    tryEnableQaDemoSession = true;

    const result = guard.canActivate({} as never, { url: '/settings?demo=true' } as never);

    expect(createUrlTreeCalls).toEqual([[['/login']]]);
    expect(result).toBe(loginUrlTree);
    expect(tryEnableQaDemoSessionCalls).toBe(0);
  });

  it('should allow navigation with demo bypass when requested and enabled', () => {
    isQaDemoBypassRequested = true;
    tryEnableQaDemoSession = true;

    const result = guard.canActivate({} as never, { url: '/dashboard?demo=true' } as never);

    expect(result).toBe(true);
    expect(createUrlTreeCalls).toEqual([]);
    expect(tryEnableQaDemoSessionCalls).toBe(1);
  });

  it('should redirect to /login when unauthenticated', () => {
    isAuthenticated = false;
    isQaDemoBypassRequested = false;

    const result = guard.canActivate({} as never, { url: '/dashboard' } as never);

    expect(createUrlTreeCalls).toEqual([[['/login']]]);
    expect(result).toBe(loginUrlTree);
  });
});
