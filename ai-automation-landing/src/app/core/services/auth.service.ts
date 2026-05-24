import { Injectable, inject } from '@angular/core';

import { AppStore } from '../../state/app.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly appStore = inject(AppStore);

  private readonly qaAllowedHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

  isAuthenticated(): boolean {
    return this.appStore.isAuthenticated();
  }

  isQaDemoBypassRequested(url?: string): boolean {
    if (!url) {
      return false;
    }

    const queryIndex = url.indexOf('?');
    if (queryIndex < 0) {
      return false;
    }

    const params = new URLSearchParams(url.slice(queryIndex + 1));
    return params.get('demo') === 'true';
  }

  canUseQaDemoAuth(hostname = this.getCurrentHostname()): boolean {
    if (!hostname) {
      return false;
    }

    const normalizedHost = hostname.toLowerCase();

    if (this.qaAllowedHosts.has(normalizedHost)) {
      return true;
    }

    return normalizedHost.endsWith('.vercel.app');
  }

  tryEnableQaDemoSession(): boolean {
    if (!this.canUseQaDemoAuth()) {
      return false;
    }

    this.appStore.seedDashboardDemo();
    return true;
  }

  private getCurrentHostname(): string {
    if (typeof globalThis === 'undefined' || !('location' in globalThis)) {
      return '';
    }

    return globalThis.location?.hostname ?? '';
  }
}
