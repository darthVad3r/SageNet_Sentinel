import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppStore } from '../../state/app.store';
import { OnboardingGuideService } from './onboarding-guide.service';

const flushAsync = (): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('OnboardingGuideService', () => {
  let appStore: AppStore;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AppStore, OnboardingGuideService],
    });

    appStore = TestBed.inject(AppStore);
  });

  it('shows onboarding guide for first authenticated session', async () => {
    const service = TestBed.inject(OnboardingGuideService);

    appStore.setAuthenticated({
      id: 'user-1',
      name: 'User One',
      email: 'user-1@example.com',
      avatarUrl: null,
      role: 'member',
    });

    await flushAsync();

    expect(service.isVisible()).toBe(true);
    expect(service.checklist()).toHaveLength(4);
    expect(service.completedCount()).toBe(0);
  });

  it('persists progress per user and restores it on subsequent sessions', async () => {
    const service = TestBed.inject(OnboardingGuideService);

    appStore.setAuthenticated({
      id: 'user-2',
      name: 'User Two',
      email: 'user-2@example.com',
      avatarUrl: null,
      role: 'member',
    });

    await flushAsync();

    service.setStepCompleted('complete-questionnaire', true);
    service.dismissGuide();

    appStore.logout();

    appStore.setAuthenticated({
      id: 'user-2',
      name: 'User Two',
      email: 'user-2@example.com',
      avatarUrl: null,
      role: 'member',
    });

    await flushAsync();

    expect(service.isVisible()).toBe(false);
    expect(
      service.checklist().find((step) => step.id === 'complete-questionnaire')?.completed
    ).toBe(true);
  });

  it('allows reopening a dismissed guide from help menu action', async () => {
    const service = TestBed.inject(OnboardingGuideService);

    appStore.setAuthenticated({
      id: 'user-3',
      name: 'User Three',
      email: 'user-3@example.com',
      avatarUrl: null,
      role: 'member',
    });

    await flushAsync();

    service.dismissGuide();
    expect(service.isVisible()).toBe(false);

    service.reopenGuide();
    expect(service.isVisible()).toBe(true);

    appStore.logout();
    appStore.setAuthenticated({
      id: 'user-3',
      name: 'User Three',
      email: 'user-3@example.com',
      avatarUrl: null,
      role: 'member',
    });

    await flushAsync();

    expect(service.isVisible()).toBe(true);
  });
});
