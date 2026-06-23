import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { type LeadSubmission, type PreferredContactMethod } from '@core/services/lead-contract';
import { LeadIntakeService } from '@core/services/lead-intake.service';
import { LandingContentService } from '../../core/services/landing-content.service';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { FeatureCardComponent } from '../../shared/ui/feature-card.component';

const PROCESS_DESCRIPTION_MIN_LENGTH = 40;

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [ReactiveFormsModule, CtaButtonComponent, FeatureCardComponent],
  template: `
    <section class="page-shell">
      <div class="page-shell__inner">
        <div class="page-shell__content">
          <p class="page-shell__eyebrow">Strategy booking</p>
          <h1>Share your process and book the architecture call.</h1>
          <p>
            Tell us how your current workflow operates and where the bottlenecks are. We will use
            that intake to tailor the call and prepare concrete automation options.
          </p>

          @if (submittedLead(); as lead) {
            <div class="confirmation-card" aria-live="polite">
              <h2>Thanks, {{ lead.name }}.</h2>
              <p>
                Your intake has been captured. We will review the process details, then follow up
                using your preferred contact method.
              </p>
              <ul class="confirmation-list">
                <li>Company: {{ lead.company }}</li>
                <li>Preferred contact: {{ formatContactMethod(lead.preferredContactMethod) }}</li>
                <li>Lead source: {{ lead.source.route }}</li>
              </ul>
              <div class="page-shell__actions">
                <app-cta-button
                  label="Open booking calendar"
                  [link]="bookingUrl"
                  [external]="true"
                ></app-cta-button>
                <button type="button" class="secondary-action" (click)="startAnotherSubmission()">
                  Submit another intake
                </button>
              </div>
            </div>
          } @else {
            <form class="lead-form" [formGroup]="leadForm" (ngSubmit)="submitLead()" novalidate>
              <div class="lead-form__grid">
                <label class="field">
                  <span>Name</span>
                  <input type="text" formControlName="name" autocomplete="name" />
                  @if (showError('name', 'required')) {
                    <small>Name is required.</small>
                  }
                </label>

                <label class="field">
                  <span>Email</span>
                  <input type="email" formControlName="email" autocomplete="email" />
                  @if (showError('email', 'required')) {
                    <small>Email is required.</small>
                  }
                  @if (showError('email', 'email')) {
                    <small>Enter a valid email address.</small>
                  }
                </label>

                <label class="field">
                  <span>Company</span>
                  <input type="text" formControlName="company" autocomplete="organization" />
                  @if (showError('company', 'required')) {
                    <small>Company is required.</small>
                  }
                </label>

                <label class="field">
                  <span>Role</span>
                  <input type="text" formControlName="role" autocomplete="organization-title" />
                  @if (showError('role', 'required')) {
                    <small>Role is required.</small>
                  }
                </label>
              </div>

              <label class="field field--full">
                <span>Preferred contact method</span>
                <select formControlName="preferredContactMethod">
                  @for (option of contactMethodOptions; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              </label>

              <label class="field field--full">
                <span>Describe the process you want help automating</span>
                <textarea
                  rows="6"
                  formControlName="processDescription"
                  placeholder="Describe the current workflow, the handoffs involved, and where time gets lost."
                ></textarea>
                <small class="field__hint">
                  Minimum {{ processDescriptionMinLength }} characters.
                </small>
                @if (showError('processDescription', 'required')) {
                  <small>Process description is required.</small>
                }
                @if (showError('processDescription', 'minlength')) {
                  <small> Add a little more detail so we can assess automation fit. </small>
                }
              </label>

              <div class="source-note">
                Source captured for this lead: <strong>{{ sourceSummary() }}</strong>
              </div>

              @if (submitError(); as errorMessage) {
                <p class="form-error" aria-live="polite">{{ errorMessage }}</p>
              }

              <div class="page-shell__actions">
                <button type="submit" class="primary-action" [disabled]="isSubmitting()">
                  {{ isSubmitting() ? 'Sending...' : 'Send intake' }}
                </button>
                <app-cta-button
                  label="Open booking calendar"
                  [link]="bookingUrl"
                  [external]="true"
                ></app-cta-button>
              </div>
            </form>
          }
        </div>

        <app-feature-card
          eyebrow="Why this route exists"
          title="Focused conversion page"
          body="The booking module can now capture intake context before the meeting so outreach, routing, and follow-up are based on the client’s real process instead of a generic CTA click."
        ></app-feature-card>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell {
        padding: 3rem 0;
      }

      .page-shell__inner {
        width: min(960px, calc(100% - 2rem));
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
        gap: 1rem;
        align-items: start;
      }

      .page-shell__content {
        padding: clamp(1.5rem, 3vw, 2.4rem);
        border-radius: 1.6rem;
        border: 1px solid var(--lab-line);
        background: var(--lab-surface);
        box-shadow: var(--lab-shadow-2);
        display: grid;
        gap: 1.25rem;
      }

      .page-shell__eyebrow,
      h1,
      p {
        margin: 0;
      }

      .page-shell__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.74rem;
        font-weight: 700;
        color: var(--lab-color-primary-strong);
      }

      h1 {
        margin-top: 0.8rem;
        font-size: clamp(2rem, 4vw, 3.6rem);
        line-height: 1.05;
      }

      p {
        color: var(--lab-ink-soft);
        line-height: 1.7;
        max-width: 42rem;
      }

      .lead-form {
        display: grid;
        gap: 1rem;
      }

      .lead-form__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .field {
        display: grid;
        gap: 0.45rem;
        color: var(--lab-ink);
        font-weight: 600;
      }

      .field--full {
        grid-column: 1 / -1;
      }

      .field input,
      .field select,
      .field textarea {
        width: 100%;
        border: 1px solid var(--lab-line);
        border-radius: 0.9rem;
        padding: 0.85rem 0.95rem;
        font: inherit;
        color: var(--lab-ink);
        background: var(--lab-surface-muted);
      }

      .field textarea {
        resize: vertical;
        min-height: 10rem;
      }

      .field small {
        color: var(--lab-danger);
        font-weight: 500;
      }

      .field__hint {
        color: var(--lab-ink-soft) !important;
      }

      .form-error {
        color: var(--lab-danger);
        font-weight: 600;
      }

      .source-note {
        padding: 0.9rem 1rem;
        border-radius: 0.9rem;
        background: var(--lab-surface-muted);
        color: var(--lab-ink-soft);
      }

      .page-shell__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.9rem;
        align-items: center;
      }

      .primary-action,
      .secondary-action {
        appearance: none;
        border-radius: 999px;
        padding: 0.9rem 1.35rem;
        font: inherit;
        cursor: pointer;
        transition:
          transform 0.2s ease,
          border-color 0.2s ease,
          background-color 0.2s ease;
      }

      .primary-action {
        border: 1px solid var(--lab-color-primary-strong);
        background: var(--lab-color-primary);
        color: var(--lab-color-primary-contrast);
      }

      .primary-action[disabled] {
        opacity: 0.75;
        cursor: wait;
      }

      .secondary-action {
        border: 1px solid var(--lab-line);
        background: transparent;
        color: var(--lab-ink);
      }

      .primary-action:hover,
      .secondary-action:hover {
        transform: translateY(-1px);
      }

      .confirmation-card {
        display: grid;
        gap: 1rem;
        padding: 1.1rem;
        border-radius: 1rem;
        border: 1px solid color-mix(in srgb, var(--lab-success) 35%, var(--lab-line) 65%);
        background: color-mix(in srgb, var(--lab-success) 10%, var(--lab-surface) 90%);
      }

      .confirmation-card h2,
      .confirmation-list {
        margin: 0;
      }

      .confirmation-list {
        padding-left: 1.2rem;
        color: var(--lab-ink-soft);
      }

      @media (max-width: 1024px) {
        .page-shell__inner {
          grid-template-columns: 1fr;
        }

        .lead-form__grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .page-shell__inner {
          width: min(960px, calc(100% - 1.25rem));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPageComponent {
  private readonly leadIntakeService = inject(LeadIntakeService);

  private readonly contentService = inject(LandingContentService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly formBuilder = inject(FormBuilder);

  private readonly submittedLeadState = signal<LeadSubmission | null>(null);

  private readonly formSubmittedState = signal(false);

  private readonly submitErrorState = signal<string | null>(null);

  readonly processDescriptionMinLength = PROCESS_DESCRIPTION_MIN_LENGTH;

  readonly submittedLead = this.submittedLeadState.asReadonly();

  readonly submitError = this.submitErrorState.asReadonly();

  readonly isSubmitting = this.leadIntakeService.isLoading;

  readonly contactMethodOptions: readonly { value: PreferredContactMethod; label: string }[] = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'video', label: 'Video call' },
  ];

  readonly leadForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    company: ['', [Validators.required]],
    role: ['', [Validators.required]],
    preferredContactMethod: ['email' as PreferredContactMethod, [Validators.required]],
    processDescription: [
      '',
      [Validators.required, Validators.minLength(PROCESS_DESCRIPTION_MIN_LENGTH)],
    ],
  });

  readonly bookingUrl = this.contentService.bookingUrl;

  readonly sourceSummary = computed(() => {
    const queryParams = this.route.snapshot.queryParams as Record<string, string | undefined>;
    const source = queryParams['utm_source'];
    const campaign = queryParams['utm_campaign'];

    if (source && campaign) {
      return `${this.router.url.split('?')[0]} · ${source} / ${campaign}`;
    }

    if (source) {
      return `${this.router.url.split('?')[0]} · ${source}`;
    }

    return this.router.url.split('?')[0];
  });

  showError(
    controlName: 'name' | 'email' | 'company' | 'role' | 'processDescription',
    error: string
  ): boolean {
    const control = this.leadForm.controls[controlName];
    if (!control) {
      return false;
    }

    return control.hasError(error) && (control.touched || this.formSubmittedState());
  }

  async submitLead(): Promise<void> {
    this.formSubmittedState.set(true);
    this.submitErrorState.set(null);

    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }

    const value = this.leadForm.getRawValue();
    const queryParams = this.route.snapshot.queryParams as Record<string, string>;
    try {
      const submission = await this.leadIntakeService.submitLead({
        name: value.name,
        email: value.email,
        company: value.company,
        role: value.role,
        processDescription: value.processDescription,
        preferredContactMethod: value.preferredContactMethod,
        route: this.router.url.split('?')[0],
        queryParams,
      });

      this.submittedLeadState.set(submission);
    } catch {
      this.submitErrorState.set(
        'We could not submit your intake right now. Please try again or use the booking calendar.'
      );
    }
  }

  startAnotherSubmission(): void {
    this.submittedLeadState.set(null);
    this.formSubmittedState.set(false);
    this.submitErrorState.set(null);
    this.leadForm.reset({
      name: '',
      email: '',
      company: '',
      role: '',
      preferredContactMethod: 'email',
      processDescription: '',
    });
  }

  formatContactMethod(contactMethod: PreferredContactMethod): string {
    return (
      this.contactMethodOptions.find((option) => option.value === contactMethod)?.label ??
      contactMethod
    );
  }
}
