import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  OnboardingChecklistStepId,
  OnboardingGuideService,
} from '@core/services/onboarding-guide.service';

@Component({
  selector: 'app-onboarding-guide',
  standalone: true,
  template: `
    @if (onboardingGuide.isVisible()) {
      <section class="onboarding-guide surface-card" aria-label="Onboarding guide">
        <header class="onboarding-guide__header">
          <h3>Getting Started Checklist</h3>
          <p>{{ onboardingGuide.completedCount() }}/{{ onboardingGuide.totalCount() }} complete</p>
        </header>

        <ul class="onboarding-guide__list">
          @for (item of onboardingGuide.checklist(); track item.id) {
            <li class="onboarding-guide__item">
              <label>
                <input
                  type="checkbox"
                  [checked]="item.completed"
                  (change)="setStepCompleted(item.id, ($event.target as HTMLInputElement).checked)"
                />
                <span>{{ item.label }}</span>
              </label>
            </li>
          }
        </ul>

        <div class="onboarding-guide__actions">
          <button type="button" (click)="onboardingGuide.dismissGuide()">Dismiss guide</button>
        </div>
      </section>
    }
  `,
  styles: [
    `
      .onboarding-guide {
        display: grid;
        gap: var(--lab-space-3);
      }

      .onboarding-guide__header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--lab-space-2);
      }

      .onboarding-guide__header h3,
      .onboarding-guide__header p {
        margin: 0;
      }

      .onboarding-guide__header h3 {
        font-size: var(--lab-text-lg);
      }

      .onboarding-guide__header p {
        color: var(--lab-ink-soft);
        font-size: var(--lab-text-sm);
      }

      .onboarding-guide__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--lab-space-2);
      }

      .onboarding-guide__item label {
        display: flex;
        align-items: center;
        gap: var(--lab-space-2);
      }

      .onboarding-guide__actions {
        display: flex;
        justify-content: flex-end;
      }

      .onboarding-guide__actions button {
        border: 1px solid var(--lab-line);
        border-radius: var(--lab-radius-md);
        background: var(--lab-surface);
        color: var(--lab-ink);
        padding: var(--lab-space-1) var(--lab-space-3);
        font-size: var(--lab-text-sm);
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingGuideComponent {
  readonly onboardingGuide = inject(OnboardingGuideService);

  setStepCompleted(stepId: OnboardingChecklistStepId, completed: boolean): void {
    this.onboardingGuide.setStepCompleted(stepId, completed);
  }
}
