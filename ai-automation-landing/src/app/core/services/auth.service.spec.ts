import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AppStore } from '../../state/app.store';
import { AuthService } from './auth.service';

type GlobalWithAuthConfig = typeof globalThis & {
  __LAB_AUTH_CONFIG__?: {
    enabled?: boolean;
    users?: {
      id?: string;
      email: string;
      password: string;
      name: string;
      role?: string;
      avatarUrl?: string;
    }[];
  };
};

describe('AuthService', () => {
  let service: AuthService;
  let appStoreMock: {
    isAuthenticated: () => boolean;
    setAuthenticated: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  const setAuthConfig = (enabled: boolean): void => {
    (globalThis as GlobalWithAuthConfig).__LAB_AUTH_CONFIG__ = {
      enabled,
      users: [
        {
          id: 'owner-id',
          email: 'owner@ai-automation-lab.local',
          password: 'lab-private-access',
          name: 'Lab Owner',
          role: 'admin',
        },
      ],
    };
  };

  const storageKeys = {
    session: 'lab.auth.session',
    token: 'lab.auth.token',
  };

  beforeEach(() => {
    appStoreMock = {
      isAuthenticated: () => false,
      setAuthenticated: vi.fn(),
      logout: vi.fn(),
    };

    localStorage.clear();
    delete (globalThis as GlobalWithAuthConfig).__LAB_AUTH_CONFIG__;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: AppStore,
          useValue: appStoreMock,
        },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
    delete (globalThis as GlobalWithAuthConfig).__LAB_AUTH_CONFIG__;
  });

  it('logs in successfully with configured credentials', async () => {
    setAuthConfig(true);

    const didLogin = await service.login('owner@ai-automation-lab.local', 'lab-private-access');

    expect(didLogin).toBe(true);
    expect(appStoreMock.setAuthenticated).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(storageKeys.session)).toContain('owner@ai-automation-lab.local');
    expect(localStorage.getItem(storageKeys.token)).toContain('lab.');
  });

  it('rejects login when credentials are invalid', async () => {
    setAuthConfig(true);

    const didLogin = await service.login('owner@ai-automation-lab.local', 'invalid-password');

    expect(didLogin).toBe(false);
    expect(appStoreMock.setAuthenticated).not.toHaveBeenCalled();
  });

  it('rejects login when auth is disabled in runtime config', async () => {
    setAuthConfig(false);

    const didLogin = await service.login('owner@ai-automation-lab.local', 'lab-private-access');

    expect(didLogin).toBe(false);
    expect(appStoreMock.setAuthenticated).not.toHaveBeenCalled();
  });

  it('restores an existing persisted session on service initialization', () => {
    localStorage.setItem(
      storageKeys.session,
      JSON.stringify({
        id: 'owner-id',
        name: 'Lab Owner',
        email: 'owner@ai-automation-lab.local',
        avatarUrl: null,
        role: 'admin',
      })
    );
    localStorage.setItem(storageKeys.token, 'lab.saved-token');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: AppStore,
          useValue: appStoreMock,
        },
      ],
    });

    TestBed.inject(AuthService);

    expect(appStoreMock.setAuthenticated).toHaveBeenCalledWith({
      id: 'owner-id',
      name: 'Lab Owner',
      email: 'owner@ai-automation-lab.local',
      avatarUrl: null,
      role: 'admin',
    });
  });

  it('clears persisted session and store state on logout', async () => {
    setAuthConfig(true);
    await service.login('owner@ai-automation-lab.local', 'lab-private-access');

    service.logout();

    expect(appStoreMock.logout).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(storageKeys.session)).toBeNull();
    expect(localStorage.getItem(storageKeys.token)).toBeNull();
  });

  it('returns null token when no session exists', () => {
    expect(service.getAccessToken()).toBeNull();
  });

  it('returns the stored token when available', () => {
    localStorage.setItem(storageKeys.token, 'lab.persisted-token');

    expect(service.getAccessToken()).toBe('lab.persisted-token');
  });
});
