import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  LEAD_API_SCHEMA_VERSION,
  LeadContractError,
  LeadIntakeService,
} from './lead-intake.service';

type GlobalWithRuntimeConfig = typeof globalThis & {
  __LAB_RUNTIME_CONFIG__?: {
    backendApiBaseUrl?: string;
  };
};

describe('LeadIntakeService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeadIntakeService, provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    delete (globalThis as GlobalWithRuntimeConfig).__LAB_RUNTIME_CONFIG__;
    httpTestingController.verify();
  });

  it('posts submissions to /api/leads with route and utm metadata', async () => {
    const service = TestBed.inject(LeadIntakeService);
    const submissionPromise = service.submitLead({
      name: 'Casey Client',
      email: 'casey@example.com',
      company: 'Orbit Labs',
      role: 'Operations Lead',
      processDescription:
        'We manually coordinate sales follow-up and project handoff work across email and spreadsheets.',
      preferredContactMethod: 'email',
      route: '/book',
      queryParams: {
        utm_source: 'newsletter',
        utm_medium: 'email',
        utm_campaign: 'summer-launch',
      },
    });

    const request = httpTestingController.expectOne('/api/leads');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      schemaVersion: LEAD_API_SCHEMA_VERSION,
      data: {
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
            utm_medium: 'email',
            utm_campaign: 'summer-launch',
          },
          utm: {
            source: 'newsletter',
            medium: 'email',
            campaign: 'summer-launch',
            term: null,
            content: null,
          },
        },
      },
    });

    request.flush({
      schemaVersion: LEAD_API_SCHEMA_VERSION,
      data: {
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
            utm_medium: 'email',
            utm_campaign: 'summer-launch',
          },
          utm: {
            source: 'newsletter',
            medium: 'email',
            campaign: 'summer-launch',
            term: null,
            content: null,
          },
        },
      },
    });

    const submission = await submissionPromise;

    expect(submission.source.route).toBe('/book');
    expect(submission.source.utm.source).toBe('newsletter');
    expect(submission.source.utm.medium).toBe('email');
    expect(submission.source.utm.campaign).toBe('summer-launch');
    expect(service.submissions()).toHaveLength(1);
  });

  it('loads submissions from /api/leads', async () => {
    const service = TestBed.inject(LeadIntakeService);
    const loadPromise = service.loadSubmissions(5);

    const request = httpTestingController.expectOne((candidate) => candidate.url === '/api/leads');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('limit')).toBe('5');

    request.flush({
      schemaVersion: LEAD_API_SCHEMA_VERSION,
      data: [
        {
          id: 'lead-123',
          submittedAt: '2026-06-11T13:00:00.000Z',
          name: 'Casey Client',
          email: 'casey@example.com',
          company: 'Orbit Labs',
          role: 'Operations Lead',
          processDescription:
            'We manually coordinate sales follow-up across email and spreadsheets.',
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
      ],
    });

    const submissions = await loadPromise;
    expect(submissions).toHaveLength(1);
    expect(submissions[0]?.preferredContactMethod).toBe('phone');
  });

  it('rejects invalid contract responses', async () => {
    const service = TestBed.inject(LeadIntakeService);
    const loadPromise = service.loadSubmissions();

    const request = httpTestingController.expectOne('/api/leads');
    request.flush({
      schemaVersion: LEAD_API_SCHEMA_VERSION,
      data: [{ id: null }],
    });

    await expect(loadPromise).rejects.toBeInstanceOf(LeadContractError);
  });

  it('targets configured backend base URL when runtime config is provided', async () => {
    (globalThis as GlobalWithRuntimeConfig).__LAB_RUNTIME_CONFIG__ = {
      backendApiBaseUrl: 'https://api.example.com',
    };

    const service = TestBed.inject(LeadIntakeService);
    const loadPromise = service.loadSubmissions(2);

    const request = httpTestingController.expectOne(
      (candidate) => candidate.url === 'https://api.example.com/api/leads'
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('limit')).toBe('2');

    request.flush({
      schemaVersion: LEAD_API_SCHEMA_VERSION,
      data: [],
    });

    await expect(loadPromise).resolves.toEqual([]);
  });
});
