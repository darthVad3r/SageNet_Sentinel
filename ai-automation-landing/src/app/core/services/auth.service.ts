import { computed, inject, Injectable, signal } from '@angular/core';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

import { UserMetadata } from '../../state/app.state';
import { AppStore } from '../../state/app.store';

interface AuthProviderConfig {
  readonly enabled?: boolean;
  readonly provider?: 'supabase';
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
}

type AuthGlobal = typeof globalThis & {
  __LAB_AUTH_CONFIG__?: AuthProviderConfig;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly appStore = inject(AppStore);

  private readonly sessionState = signal<Session | null>(null);

  private readonly initializedState = signal(false);

  private readonly configuredState = signal(false);

  private readonly loginErrorState = signal<string | null>(null);

  private client: SupabaseClient | null = null;

  private authStateChangeUnsubscribe: (() => void) | null = null;

  readonly session = this.sessionState.asReadonly();

  readonly isInitialized = this.initializedState.asReadonly();

  readonly isConfigured = this.configuredState.asReadonly();

  readonly loginError = this.loginErrorState.asReadonly();

  readonly user = computed(() => this.sessionState()?.user ?? null);

  isAuthenticated(): boolean {
    return !!this.sessionState();
  }

  async initialize(): Promise<void> {
    if (this.initializedState()) {
      return;
    }

    const authConfig = this.readAuthConfig();
    if (authConfig.enabled === false || !authConfig.supabaseUrl || !authConfig.supabaseAnonKey) {
      this.syncSession(null);
      this.initializedState.set(true);
      return;
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');

      this.client = createClient(authConfig.supabaseUrl, authConfig.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });

      const {
        data: { session },
      } = await this.client.auth.getSession();

      this.syncSession(session);

      const { data } = this.client.auth.onAuthStateChange((_event, nextSession) => {
        this.syncSession(nextSession);
      });
      this.authStateChangeUnsubscribe = data?.subscription?.unsubscribe ?? null;

      this.configuredState.set(true);
    } catch (error) {
      console.error('[AuthService] Failed to initialize provider:', error);
      this.syncSession(null);
    } finally {
      this.initializedState.set(true);
    }
  }

  getAccessToken(): string | null {
    return this.sessionState()?.access_token ?? null;
  }

  async login(email: string, password: string): Promise<boolean> {
    this.loginErrorState.set(null);

    if (!this.client) {
      this.loginErrorState.set(
        'Authentication provider is not initialized yet. Refresh and retry.'
      );
      return false;
    }

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        this.loginErrorState.set(this.toUserFacingAuthError(error.message));
        return false;
      }

      if (!data.session) {
        this.loginErrorState.set('Sign-in did not return a session. Please try again.');
        return false;
      }

      this.syncSession(data.session);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : null;
      this.loginErrorState.set(this.toUserFacingAuthError(message));
      return false;
    }
  }

  async logout(): Promise<void> {
    if (this.client) {
      await this.client.auth.signOut();
    }

    this.authStateChangeUnsubscribe?.();
    this.authStateChangeUnsubscribe = null;
    this.syncSession(null);
  }

  private readAuthConfig(): AuthProviderConfig {
    const config = (globalThis as AuthGlobal).__LAB_AUTH_CONFIG__;
    return {
      enabled: config?.enabled !== false,
      provider: 'supabase',
      supabaseUrl: config?.supabaseUrl,
      supabaseAnonKey: config?.supabaseAnonKey,
    };
  }

  private syncSession(session: Session | null): void {
    this.sessionState.set(session);

    if (!session?.user) {
      this.appStore.logout();
      return;
    }

    this.appStore.setAuthenticated(this.mapToUserMetadata(session.user));
  }

  private mapToUserMetadata(user: User): UserMetadata {
    const authMetadata = user.user_metadata ?? {};
    const appMetadata = user.app_metadata ?? {};
    const displayName =
      this.readStringMetadata(authMetadata, ['full_name', 'name', 'display_name']) ?? user.email;

    return {
      id: user.id,
      name: displayName ?? null,
      email: user.email ?? null,
      avatarUrl: this.readStringMetadata(authMetadata, ['avatar_url', 'picture', 'avatar']) ?? null,
      role:
        this.readStringMetadata(appMetadata, ['role']) ??
        this.readStringMetadata(authMetadata, ['role']) ??
        'member',
    };
  }

  private readStringMetadata(
    metadata: Record<string, unknown>,
    keys: readonly string[]
  ): string | null {
    for (const key of keys) {
      const value = metadata[key];
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }

    return null;
  }

  private toUserFacingAuthError(message: string | null | undefined): string {
    if (!message) {
      return 'Unable to sign in right now. Please try again.';
    }

    const normalized = message.toLowerCase();

    if (normalized.includes('email not confirmed')) {
      return 'Email is not confirmed in Supabase. Confirm the account and retry.';
    }

    if (normalized.includes('invalid login credentials')) {
      return 'Invalid login credentials. Verify email/password for this Supabase project.';
    }

    if (normalized.includes('network') || normalized.includes('fetch')) {
      return 'Network error contacting Supabase. Check connectivity and project URL.';
    }

    return message;
  }
}
