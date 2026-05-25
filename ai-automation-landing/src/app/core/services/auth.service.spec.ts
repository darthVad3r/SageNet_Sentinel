import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AppStore } from '../../state/app.store';
import { AuthService } from './auth.service';

type GlobalWithQaConfig = typeof globalThis & {
  __LAB_QA_DEMO_AUTH_CONFIG__?: {
    enabled?: boolean;
    allowedHosts?: string[];
  };
};

describe('AuthService', () => {
  let service: AuthService;
  let appStoreMock: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    seedDashboardDemo: ReturnType<typeof vi.fn>;
  };

  const setQaConfig = (enabled: boolean, allowedHosts: string[] = []): void => {
    (globalThis as GlobalWithQaConfig).__LAB_QA_DEMO_AUTH_CONFIG__ = {
      enabled,
      allowedHosts,
    };
  };

  beforeEach(() => {
    appStoreMock = {
      isAuthenticated: vi.fn(() => false),
      seedDashboardDemo: vi.fn(),
    };

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
    delete (globalThis as GlobalWithQaConfig).__LAB_QA_DEMO_AUTH_CONFIG__;
  });

  afterEach(() => {
    delete (globalThis as GlobalWithQaConfig).__LAB_QA_DEMO_AUTH_CONFIG__;
  });

  it('detects the demo bypass query flag only when demo=true', () => {
    expect(service.isQaDemoBypassRequested('/dashboard?demo=true')).toBe(true);
    expect(service.isQaDemoBypassRequested('/dashboard?demo=false')).toBe(false);
    expect(service.isQaDemoBypassRequested('/dashboard')).toBe(false);
  });

  it('disables QA demo auth when runtime flag is not enabled', () => {
    setQaConfig(false, ['qa.example.com']);

    expect(service.canUseQaDemoAuth('localhost')).toBe(false);
    expect(service.canUseQaDemoAuth('qa.example.com')).toBe(false);
  });

  it('allows QA demo auth only for allowlisted hosts when runtime flag is enabled', () => {
    setQaConfig(true, ['qa.example.com']);

    expect(service.canUseQaDemoAuth('localhost')).toBe(true);
    expect(service.canUseQaDemoAuth('qa.example.com')).toBe(true);
    expect(service.canUseQaDemoAuth('preview.vercel.app')).toBe(false);
  });

  it('seeds demo session only when QA demo auth is allowed', () => {
    setQaConfig(true, ['qa.example.com']);
    vi.spyOn(service as any, 'getCurrentHostname').mockReturnValue('qa.example.com');

    expect(service.tryEnableQaDemoSession()).toBe(true);
    expect(appStoreMock.seedDashboardDemo).toHaveBeenCalledTimes(1);
  });

  it('does not seed demo session when QA demo auth is disallowed', () => {
    setQaConfig(false, ['qa.example.com']);
    vi.spyOn(service as any, 'getCurrentHostname').mockReturnValue('qa.example.com');

    expect(service.tryEnableQaDemoSession()).toBe(false);
    expect(appStoreMock.seedDashboardDemo).not.toHaveBeenCalled();
  });
});
