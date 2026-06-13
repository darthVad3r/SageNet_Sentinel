import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { type LeadSubmission } from '@core/services/lead-contract';
import { LeadIntakeService } from '@core/services/lead-intake.service';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  const loadSubmissions = vi.fn();
  const exportSubmissions = vi.fn();

  const leadFixture: readonly LeadSubmission[] = [
    {
      id: 'lead-123',
      submittedAt: '2026-06-11T13:00:00.000Z',
      name: 'Casey Client',
      email: 'casey@example.com',
      company: 'Orbit Labs',
      role: 'Operations Lead',
      processDescription: 'Manual follow-up workflow and spreadsheet-based handoff tracking.',
      preferredContactMethod: 'phone',
      source: {
        route: '/book',
        queryParams: {},
        utm: {
          source: null,
          medium: null,
          campaign: null,
          term: null,
          content: null,
        },
      },
    },
  ];

  const createComponent = async (): Promise<{
    fixture: ComponentFixture<SettingsComponent>;
    component: SettingsComponent;
  }> => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        {
          provide: LeadIntakeService,
          useValue: {
            submissions: () => leadFixture,
            isLoading: () => false,
            loadSubmissions,
            exportSubmissions,
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
    };
  };

  beforeEach(() => {
    loadSubmissions.mockReset();
    exportSubmissions.mockReset();
    loadSubmissions.mockResolvedValue(leadFixture);
    exportSubmissions.mockReturnValue(JSON.stringify(leadFixture));
  });

  it('loads recent submissions on startup', async () => {
    await createComponent();

    expect(loadSubmissions).toHaveBeenCalledWith(5);
  });

  it('sets a load error when refreshing submissions fails', async () => {
    loadSubmissions.mockRejectedValue(new Error('Network error'));
    const { component } = await createComponent();

    await component.refreshLeadSubmissions();

    expect(component.loadError()).toBe('We could not load lead submissions from /api/leads.');
  });
});
