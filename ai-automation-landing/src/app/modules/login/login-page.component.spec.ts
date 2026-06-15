import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '@core/services/auth.service';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  const login = vi.fn();
  const isConfigured = vi.fn();
  const isInitialized = vi.fn();
  const initialize = vi.fn();
  const navigateByUrl = vi.fn();

  const createComponent = (redirectTo: string | null): LoginPageComponent => {
    TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login,
            isConfigured,
            isInitialized,
            initialize,
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(redirectTo ? { redirectTo } : {}),
            },
          },
        },
      ],
    });

    return TestBed.createComponent(LoginPageComponent).componentInstance;
  };

  beforeEach(() => {
    login.mockReset();
    isConfigured.mockReset();
    isInitialized.mockReset();
    initialize.mockReset();
    navigateByUrl.mockReset();
    isInitialized.mockReturnValue(true);
    isConfigured.mockReturnValue(true);
  });

  it('navigates to redirectTo after successful login', async () => {
    login.mockResolvedValue(true);
    const component = createComponent('/workflows');
    component.email = 'owner@example.com';
    component.password = 'secret';

    await component.submit();

    expect(login).toHaveBeenCalledWith('owner@example.com', 'secret');
    expect(navigateByUrl).toHaveBeenCalledWith('/workflows');
    expect(component.errorMessage()).toBeNull();
  });

  it('navigates to dashboard when redirectTo is not set', async () => {
    login.mockResolvedValue(true);
    const component = createComponent(null);
    component.email = 'owner@example.com';
    component.password = 'secret';

    await component.submit();

    expect(navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('ignores unsafe redirectTo values that are not app-relative', async () => {
    login.mockResolvedValue(true);
    const component = createComponent('https://malicious.example');
    component.email = 'owner@example.com';
    component.password = 'secret';

    await component.submit();

    expect(navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error and stays on page when login fails', async () => {
    login.mockResolvedValue(false);
    const component = createComponent('/dashboard');
    component.email = 'owner@example.com';
    component.password = 'bad-password';

    await component.submit();

    expect(navigateByUrl).not.toHaveBeenCalled();
    expect(component.errorMessage()).toBe(
      'Sign-in failed. Verify your Supabase credentials and user account.'
    );
  });

  it('disables submit button when auth provider is not configured', () => {
    isConfigured.mockReturnValue(false);
    const fixture = TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login,
            isConfigured,
            isInitialized,
            initialize,
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).createComponent(LoginPageComponent);

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      '.login-page__submit'
    ) as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
  });
});
