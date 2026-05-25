import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Auth Guard placeholder
 * Protects routes that require authentication
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private static readonly DASHBOARD_ROUTE_PREFIX = '/dashboard';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    if (
      this.isQaDemoRoute(state.url) &&
      this.authService.isQaDemoBypassRequested(state.url) &&
      this.authService.tryEnableQaDemoSession()
    ) {
      return true;
    }

    return this.router.createUrlTree(['/login']);
  }

  private isQaDemoRoute(url: string): boolean {
    const path = url.split('?')[0]?.toLowerCase() ?? '';
    return (
      path === AuthGuard.DASHBOARD_ROUTE_PREFIX ||
      path.startsWith(`${AuthGuard.DASHBOARD_ROUTE_PREFIX}/`)
    );
  }
}
