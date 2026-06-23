import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';

import { type LeadSubmission } from '@core/services/lead-contract';
import { LeadIntakeService } from '@core/services/lead-intake.service';

import { BookPageComponent } from './book-page.component';

describe('BookPageComponent', () => {
  const submitLead = vi.fn();

  const leadFixture: LeadSubmission = {
    id: 'lead-123',
    submittedAt: '2026-06-11T13:00:00.000Z',
    name: 'Casey Client',
    email: 'casey@example.com',
    company: 'Orbit Labs',
    role: 'Operations Lead',
    processDescription:
      'We manually coordinate sales follow-up and project handoff work across email and spreadsheets.',
    preferredContactMethod: 'email',
    source: {
      route: '/book',
      queryParams: {
        utm_source: 'newsletter',
      },
      utm: {
        source: 'newsletter',
        medium: null,
        campaign: null,
        term: null,
        content: null,
      },
    },
  };

  const createComponent = async (): Promise<{
    fixture: ComponentFixture<BookPageComponent>;
    component: BookPageComponent;
  }> => {
    await TestBed.configureTestingModule({
      imports: [BookPageComponent],
      providers: [
        {
          provide: LeadIntakeService,
          useValue: {
            submitLead,
            isLoading: () => false,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                utm_source: 'newsletter',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            url: '/book?utm_source=newsletter',
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BookPageComponent);
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
    };
  };

  beforeEach(() => {
    submitLead.mockReset();
  });

  it('submits the validated intake payload to the lead service', async () => {
    submitLead.mockResolvedValue(leadFixture);
    const { component } = await createComponent();

    component.leadForm.setValue({
      name: 'Casey Client',
      email: 'casey@example.com',
      company: 'Orbit Labs',
      role: 'Operations Lead',
      preferredContactMethod: 'email',
      processDescription:
        'We manually coordinate sales follow-up and project handoff work across email and spreadsheets.',
    });

    await component.submitLead();

    expect(submitLead).toHaveBeenCalledWith({
      name: 'Casey Client',
      email: 'casey@example.com',
      company: 'Orbit Labs',
      role: 'Operations Lead',
      preferredContactMethod: 'email',
      processDescription:
        'We manually coordinate sales follow-up and project handoff work across email and spreadsheets.',
      route: '/book',
      queryParams: {
        utm_source: 'newsletter',
      },
    });
    expect(component.submittedLead()?.id).toBe('lead-123');
  });

  it('shows an error message when the lead API call fails', async () => {
    submitLead.mockRejectedValue(new Error('Network error'));
    const { component } = await createComponent();

    component.leadForm.setValue({
      name: 'Casey Client',
      email: 'casey@example.com',
      company: 'Orbit Labs',
      role: 'Operations Lead',
      preferredContactMethod: 'email',
      processDescription:
        'We manually coordinate sales follow-up and project handoff work across email and spreadsheets.',
    });

    await component.submitLead();

    expect(component.submitError()).toBe(
      'We could not submit your intake right now. Please try again or use the booking calendar.'
    );
  });
});
