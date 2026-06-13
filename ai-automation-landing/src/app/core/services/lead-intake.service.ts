import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  LEAD_API_SCHEMA_VERSION,
  type LeadSourceMetadata,
  type LeadSubmission,
  type LeadSubmissionInput,
  type PreferredContactMethod,
} from './lead-contract';

export {
  LEAD_API_SCHEMA_VERSION,
  type LeadSourceMetadata,
  type LeadSubmission,
  type LeadSubmissionInput,
  type PreferredContactMethod,
} from './lead-contract';

const LEADS_API_PATH = '/api/leads';

interface LeadSubmissionEnvelope {
  readonly schemaVersion: unknown;
  readonly data: unknown;
}

export class LeadContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LeadContractError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readRequiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new LeadContractError(`${label} must be a non-empty string.`);
  }

  return value;
}

function readNullableString(value: unknown, label: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new LeadContractError(`${label} must be a string or null.`);
  }

  return value;
}

function readPreferredContactMethod(value: unknown): PreferredContactMethod {
  if (value === 'email' || value === 'phone' || value === 'video') {
    return value;
  }

  throw new LeadContractError('lead preferredContactMethod must be email, phone, or video.');
}

function readStringRecord(value: unknown, label: string): Readonly<Record<string, string>> {
  if (!isRecord(value)) {
    throw new LeadContractError(`${label} must be a string map.`);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      readRequiredString(entryValue, `${label}.${key}`),
    ])
  );
}

@Injectable({ providedIn: 'root' })
export class LeadIntakeService {
  private readonly http = inject(HttpClient);

  private readonly submissionsState = signal<readonly LeadSubmission[]>([]);

  private readonly loadingState = signal(false);

  readonly submissions = this.submissionsState.asReadonly();

  readonly isLoading = this.loadingState.asReadonly();

  readonly hasSubmissions = computed(() => this.submissionsState().length > 0);

  async loadSubmissions(limit?: number): Promise<readonly LeadSubmission[]> {
    this.loadingState.set(true);

    try {
      let params = new HttpParams();
      if (typeof limit === 'number') {
        params = params.set('limit', String(limit));
      }

      const response = await firstValueFrom(
        this.http.get<LeadSubmissionEnvelope>(LEADS_API_PATH, { params })
      );
      const submissions = this.parseSubmissionListResponse(response);
      this.submissionsState.set(submissions);
      return submissions;
    } finally {
      this.loadingState.set(false);
    }
  }

  async submitLead(input: LeadSubmissionInput): Promise<LeadSubmission> {
    this.loadingState.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<LeadSubmissionEnvelope>(LEADS_API_PATH, {
          schemaVersion: LEAD_API_SCHEMA_VERSION,
          data: {
            name: input.name.trim(),
            email: input.email.trim(),
            company: input.company.trim(),
            role: input.role.trim(),
            processDescription: input.processDescription.trim(),
            preferredContactMethod: input.preferredContactMethod,
            source: this.buildSourceMetadata(input.route, input.queryParams ?? {}),
          },
        })
      );
      const submission = this.parseSubmissionResponse(response);
      this.submissionsState.update((current) => [submission, ...current]);
      return submission;
    } finally {
      this.loadingState.set(false);
    }
  }

  exportSubmissions(submissions: readonly LeadSubmission[] = this.submissionsState()): string {
    return JSON.stringify(submissions, null, 2);
  }

  private buildSourceMetadata(
    route: string,
    queryParams: Readonly<Record<string, string>>
  ): LeadSourceMetadata {
    return {
      route,
      queryParams,
      utm: {
        source: queryParams['utm_source'] ?? null,
        medium: queryParams['utm_medium'] ?? null,
        campaign: queryParams['utm_campaign'] ?? null,
        term: queryParams['utm_term'] ?? null,
        content: queryParams['utm_content'] ?? null,
      },
    };
  }

  private parseSubmissionListResponse(response: LeadSubmissionEnvelope): readonly LeadSubmission[] {
    if (response.schemaVersion !== LEAD_API_SCHEMA_VERSION || !Array.isArray(response.data)) {
      throw new LeadContractError('Invalid /api/leads list response envelope.');
    }

    return response.data.map((entry) => this.parseLeadSubmission(entry));
  }

  private parseSubmissionResponse(response: LeadSubmissionEnvelope): LeadSubmission {
    if (response.schemaVersion !== LEAD_API_SCHEMA_VERSION) {
      throw new LeadContractError('Invalid /api/leads submit response envelope.');
    }

    return this.parseLeadSubmission(response.data);
  }

  private parseLeadSubmission(value: unknown): LeadSubmission {
    if (!isRecord(value)) {
      throw new LeadContractError('Lead payload was not an object.');
    }

    const source = value['source'];
    if (!isRecord(source) || !isRecord(source['utm']) || !isRecord(source['queryParams'])) {
      throw new LeadContractError('Lead source payload was invalid.');
    }

    return {
      id: readRequiredString(value['id'], 'lead id'),
      submittedAt: readRequiredString(value['submittedAt'], 'lead submittedAt'),
      name: readRequiredString(value['name'], 'lead name'),
      email: readRequiredString(value['email'], 'lead email'),
      company: readRequiredString(value['company'], 'lead company'),
      role: readRequiredString(value['role'], 'lead role'),
      processDescription: readRequiredString(
        value['processDescription'],
        'lead processDescription'
      ),
      preferredContactMethod: readPreferredContactMethod(value['preferredContactMethod']),
      source: {
        route: readRequiredString(source['route'], 'lead source route'),
        queryParams: readStringRecord(source['queryParams'], 'lead source queryParams'),
        utm: {
          source: readNullableString(source['utm']['source'], 'lead utm source'),
          medium: readNullableString(source['utm']['medium'], 'lead utm medium'),
          campaign: readNullableString(source['utm']['campaign'], 'lead utm campaign'),
          term: readNullableString(source['utm']['term'], 'lead utm term'),
          content: readNullableString(source['utm']['content'], 'lead utm content'),
        },
      },
    };
  }
}
