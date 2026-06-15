import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AppStore } from '../../state/app.store';
import { AuthService } from './auth.service';

const createClientMock = vi.fn();
const getSessionMock = vi.fn();
const signInWithPasswordMock = vi.fn();
const signOutMock = vi.fn();
const onAuthStateChangeMock = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

type GlobalWithAuthConfig = typeof globalThis & {
  __LAB_AUTH_CONFIG__?: {
    enabled?: boolean;
    provider?: 'supabase';
    supabaseUrl?: string;
    supabaseAnonKey?: string;
  };
};

const sessionFixture = {
  access_token: 'access-token',
  refresh_token: 'refresh-token',
  expires_in: 3600,
  expires_at: 1893456000,
  token_type: 'bearer',
  user: {
    id: 'user-id',
    email: 'owner@example.com',
    app_metadata: { role: 'admin' },
    user_metadata: {
      full_name: 'Lab Owner',
      avatar_url: 'https://example.com/avatar.png',
    },
  },
} as const;

describe('AuthService', () => {
  let appStoreMock: {
    setAuthenticated: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  const setAuthConfig = (config?: GlobalWithAuthConfig['__LAB_AUTH_CONFIG__']): void => {
    if (config) {
      (globalThis as GlobalWithAuthConfig).__LAB_AUTH_CONFIG__ = config;
      return;
    }

    delete (globalThis as GlobalWithAuthConfig).__LAB_AUTH_CONFIG__;
  };

  beforeEach(() => {
    appStoreMock = {
      setAuthenticated: vi.fn(),
      logout: vi.fn(),
    };

    getSessionMock.mockReset();
    signInWithPasswordMock.mockReset();
    signOutMock.mockReset();
    onAuthStateChangeMock.mockReset();
    createClientMock.mockReset();

    onAuthStateChangeMock.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });

    createClientMock.mockReturnValue({
      auth: {
        getSession: getSessionMock,
        signInWithPassword: signInWithPasswordMock,
        signOut: signOutMock,
        onAuthStateChange: onAuthStateChangeMock,
      },
    });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: AppStore,
          useValue: appStoreMock,
        },
      ],
    });

    setAuthConfig();
  });

  afterEach(() => {
    setAuthConfig();
  });

  it('does not create a provider client when runtime auth config is missing', async () => {
    const service = TestBed.inject(AuthService);

    await service.initialize();

    expect(createClientMock).not.toHaveBeenCalled();
    expect(service.isConfigured()).toBe(false);
    expect(service.isInitialized()).toBe(true);
  });

  it('initializes Supabase and synchronizes the existing session', async () => {
    setAuthConfig({
      enabled: true,
      provider: 'supabase',
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
    getSessionMock.mockResolvedValue({
      data: { session: sessionFixture },
    });

    const service = TestBed.inject(AuthService);
    await service.initialize();

    expect(createClientMock).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
      expect.objectContaining({
        auth: expect.objectContaining({
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        }),
      })
    );
    expect(service.isConfigured()).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getAccessToken()).toBe('access-token');
    expect(appStoreMock.setAuthenticated).toHaveBeenCalledWith({
      id: 'user-id',
      name: 'Lab Owner',
      email: 'owner@example.com',
      avatarUrl: 'https://example.com/avatar.png',
      role: 'admin',
    });
  });

  it('logs in with Supabase email and password credentials', async () => {
    setAuthConfig({
      enabled: true,
      provider: 'supabase',
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
    getSessionMock.mockResolvedValue({ data: { session: null } });
    signInWithPasswordMock.mockResolvedValue({
      data: { session: sessionFixture },
      error: null,
    });

    const service = TestBed.inject(AuthService);
    await service.initialize();

    const didLogin = await service.login('owner@example.com', 'secret-password');

    expect(didLogin).toBe(true);
    expect(service.loginError()).toBeNull();
    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: 'owner@example.com',
      password: 'secret-password',
    });
    expect(appStoreMock.setAuthenticated).toHaveBeenCalledWith({
      id: 'user-id',
      name: 'Lab Owner',
      email: 'owner@example.com',
      avatarUrl: 'https://example.com/avatar.png',
      role: 'admin',
    });
  });

  it('returns false when Supabase sign-in fails', async () => {
    setAuthConfig({
      enabled: true,
      provider: 'supabase',
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
    getSessionMock.mockResolvedValue({ data: { session: null } });
    signInWithPasswordMock.mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid login credentials' },
    });

    const service = TestBed.inject(AuthService);
    await service.initialize();

    const didLogin = await service.login('owner@example.com', 'wrong-password');

    expect(didLogin).toBe(false);
    expect(service.loginError()).toBe(
      'Invalid login credentials. Verify email/password for this Supabase project.'
    );
  });

  it('signs out and clears the synchronized session state', async () => {
    setAuthConfig({
      enabled: true,
      provider: 'supabase',
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
    getSessionMock.mockResolvedValue({ data: { session: sessionFixture } });
    signOutMock.mockResolvedValue({ error: null });

    const service = TestBed.inject(AuthService);
    await service.initialize();
    await service.logout();

    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(appStoreMock.logout).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getAccessToken()).toBeNull();
  });

  it('handles initialization errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    setAuthConfig({
      enabled: true,
      provider: 'supabase',
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
    createClientMock.mockRejectedValue(new Error('Failed to load Supabase SDK'));

    const service = TestBed.inject(AuthService);
    await service.initialize();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AuthService] Failed to initialize provider:',
      expect.any(Error)
    );
    expect(service.isInitialized()).toBe(true);
    expect(service.isConfigured()).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
    expect(appStoreMock.logout).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
