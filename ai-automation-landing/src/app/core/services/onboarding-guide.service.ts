import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { AppStore } from '../../state/app.store';

export type OnboardingChecklistStepId =
  | 'complete-questionnaire'
  | 'connect-tools'
  | 'review-roadmap'
  | 'schedule-review-call';

export interface OnboardingChecklistStep {
  readonly id: OnboardingChecklistStepId;
  readonly label: string;
  readonly completed: boolean;
}

interface OnboardingGuidePersistedState {
  readonly dismissed: boolean;
  readonly steps: Record<OnboardingChecklistStepId, boolean>;
}

const STORAGE_KEY_PREFIX = 'lab:onboarding-guide:v1';

const STEP_DEFINITIONS: ReadonlyArray<{ id: OnboardingChecklistStepId; label: string }> = [
  { id: 'complete-questionnaire', label: 'Complete questionnaire' },
  { id: 'connect-tools', label: 'Connect tools' },
  { id: 'review-roadmap', label: 'Review roadmap' },
  { id: 'schedule-review-call', label: 'Schedule review call' },
];

const DEFAULT_STEP_STATE: Record<OnboardingChecklistStepId, boolean> = {
  'complete-questionnaire': false,
  'connect-tools': false,
  'review-roadmap': false,
  'schedule-review-call': false,
};

@Injectable({ providedIn: 'root' })
export class OnboardingGuideService {
  private readonly appStore = inject(AppStore);

  private readonly activeUserId = signal<string | null>(null);

  private readonly stepState = signal<Record<OnboardingChecklistStepId, boolean>>({
    ...DEFAULT_STEP_STATE,
  });

  private readonly dismissedState = signal(false);

  private readonly visibleState = signal(false);

  readonly isVisible = this.visibleState.asReadonly();

  readonly checklist = computed<readonly OnboardingChecklistStep[]>(() => {
    const stepState = this.stepState();
    return STEP_DEFINITIONS.map((step) => ({
      id: step.id,
      label: step.label,
      completed: stepState[step.id],
    }));
  });

  readonly completedCount = computed(
    () => this.checklist().filter((step) => step.completed).length
  );

  readonly totalCount = computed(() => this.checklist().length);

  constructor() {
    effect(() => {
      const userId = this.appStore.user().id;
      if (userId === this.activeUserId()) {
        return;
      }

      this.loadForUser(userId);
    });
  }

  setStepCompleted(stepId: OnboardingChecklistStepId, completed: boolean): void {
    this.stepState.update((current) => ({
      ...current,
      [stepId]: completed,
    }));

    this.persistState();
  }

  dismissGuide(): void {
    this.dismissedState.set(true);
    this.visibleState.set(false);
    this.persistState();
  }

  reopenGuide(): void {
    if (!this.activeUserId()) {
      return;
    }

    this.dismissedState.set(false);
    this.visibleState.set(true);
    this.persistState();
  }

  private loadForUser(userId: string | null): void {
    this.activeUserId.set(userId);

    if (!userId) {
      this.stepState.set({ ...DEFAULT_STEP_STATE });
      this.dismissedState.set(false);
      this.visibleState.set(false);
      return;
    }

    const persisted = this.readPersistedState(userId);
    if (persisted) {
      this.stepState.set({ ...DEFAULT_STEP_STATE, ...persisted.steps });
      this.dismissedState.set(persisted.dismissed);
      this.visibleState.set(!persisted.dismissed);
      return;
    }

    this.stepState.set({ ...DEFAULT_STEP_STATE });
    this.dismissedState.set(false);
    this.visibleState.set(true);
    this.persistState();
  }

  private persistState(): void {
    const userId = this.activeUserId();
    const storage = this.getStorage();
    if (!userId || !storage) {
      return;
    }

    const payload: OnboardingGuidePersistedState = {
      dismissed: this.dismissedState(),
      steps: this.stepState(),
    };

    try {
      storage.setItem(this.storageKey(userId), JSON.stringify(payload));
    } catch {
      // Ignore persistence failures (quota exceeded, storage blocked, etc.).
    }
  }

  private readPersistedState(userId: string): OnboardingGuidePersistedState | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }

    let raw: string | null;
    try {
      raw = storage.getItem(this.storageKey(userId));
    } catch {
      return null;
    }

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<OnboardingGuidePersistedState>;
      if (!parsed || typeof parsed !== 'object' || !parsed.steps) {
        return null;
      }

      return {
        dismissed: parsed.dismissed === true,
        steps: {
          'complete-questionnaire': parsed.steps['complete-questionnaire'] === true,
          'connect-tools': parsed.steps['connect-tools'] === true,
          'review-roadmap': parsed.steps['review-roadmap'] === true,
          'schedule-review-call': parsed.steps['schedule-review-call'] === true,
        },
      };
    } catch {
      return null;
    }
  }

  private storageKey(userId: string): string {
    return `${STORAGE_KEY_PREFIX}:${userId}`;
  }

  private getStorage(): Storage | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      return localStorage;
    } catch {
      return null;
    }
  }
}
