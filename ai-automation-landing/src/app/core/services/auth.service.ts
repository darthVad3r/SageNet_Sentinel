import { Injectable, inject } from '@angular/core';

import { AppStore } from '../../state/app.store';

interface QaDemoAuthConfig {
  readonly enabled?: boolean;
  readonly allowedHosts?: readonly string[];
}

type QaDemoAuthGlobal = typeof globalThis & {
  __LAB_QA_DEMO_AUTH_CONFIG__?: QaDemoAuthConfig;
};

const DEFAULT_QA_ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0'] as const;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly appStore = inject(AppStore);

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

    const config = this.readQaDemoAuthConfig();
    if (!config.enabled) {
      return false;
    }

    const normalizedHost = hostname.toLowerCase();
    const allowedHosts = new Set([...DEFAULT_QA_ALLOWED_HOSTS, ...config.allowedHosts]);
    return allowedHosts.has(normalizedHost);
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

  private readQaDemoAuthConfig(): { enabled: boolean; allowedHosts: readonly string[] } {
    const config = (globalThis as QaDemoAuthGlobal).__LAB_QA_DEMO_AUTH_CONFIG__;
    return {
      enabled: config?.enabled === true,
      allowedHosts: (config?.allowedHosts ?? []).map((host) => host.toLowerCase()),
    };
  }
}
