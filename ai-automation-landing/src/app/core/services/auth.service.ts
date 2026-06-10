import { Injectable, inject } from '@angular/core';

import { UserMetadata } from '../../state/app.state';
import { AppStore } from '../../state/app.store';

interface AuthProviderUserConfig {
  readonly id?: string;
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly role?: string;
  readonly avatarUrl?: string;
}

interface AuthProviderConfig {
  readonly enabled?: boolean;
  readonly users?: readonly AuthProviderUserConfig[];
}

type AuthGlobal = typeof globalThis & {
  __LAB_AUTH_CONFIG__?: AuthProviderConfig;
};

const AUTH_STORAGE_KEY = 'lab.auth.session';

const AUTH_TOKEN_STORAGE_KEY = 'lab.auth.token';

const DEFAULT_AUTH_USERS: readonly AuthProviderUserConfig[] = [];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly appStore = inject(AppStore);

  constructor() {
    this.restoreSession();
  }

  isAuthenticated(): boolean {
    return this.appStore.isAuthenticated();
  }

  getAccessToken(): string | null {
    if (!this.supportsStorage()) {
      return null;
    }

    return globalThis.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }

  async login(email: string, password: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const authConfig = this.readAuthConfig();
    if (!authConfig.enabled || !authConfig.users.length) {
      return false;
    }

    const users = authConfig.users;

    const matchedUser = users.find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail && user.password === password
    );

    if (!matchedUser) {
      return false;
    }

    const user = this.mapToUserMetadata(matchedUser);
    const token = this.createAccessToken(user);
    this.persistSession(user, token);
    this.appStore.setAuthenticated(user);
    return true;
  }

  logout(): void {
    this.appStore.logout();
    this.clearSession();
  }

  private restoreSession(): void {
    if (!this.supportsStorage()) {
      return;
    }

    const serializedSession = globalThis.localStorage.getItem(AUTH_STORAGE_KEY);
    const token = globalThis.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!serializedSession || !token) {
      return;
    }

    try {
      const parsedSession = JSON.parse(serializedSession) as UserMetadata;
      if (!parsedSession?.id || !parsedSession.email) {
        this.clearSession();
        return;
      }

      this.appStore.setAuthenticated(parsedSession);
    } catch {
      this.clearSession();
    }
  }

  private persistSession(user: UserMetadata, token: string): void {
    if (!this.supportsStorage()) {
      return;
    }

    globalThis.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    globalThis.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }

  private clearSession(): void {
    if (!this.supportsStorage()) {
      return;
    }

    globalThis.localStorage.removeItem(AUTH_STORAGE_KEY);
    globalThis.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }

  private readAuthConfig(): { enabled: boolean; users: readonly AuthProviderUserConfig[] } {
    const config = (globalThis as AuthGlobal).__LAB_AUTH_CONFIG__;
    return {
      enabled: config?.enabled !== false,
      users: config?.users?.length ? config.users : DEFAULT_AUTH_USERS,
    };
  }

  private mapToUserMetadata(user: AuthProviderUserConfig): UserMetadata {
    return {
      id: user.id ?? user.email,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role ?? 'member',
    };
  }

  private createAccessToken(user: UserMetadata): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
    };

    return `lab.${btoa(JSON.stringify(payload))}`;
  }

  private supportsStorage(): boolean {
    return globalThis.localStorage !== undefined;
  }
}
