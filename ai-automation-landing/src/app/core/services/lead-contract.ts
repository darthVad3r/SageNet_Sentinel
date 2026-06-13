export const LEAD_API_SCHEMA_VERSION = '2026-06-11';

export type PreferredContactMethod = 'email' | 'phone' | 'video';

export interface LeadSourceMetadata {
  readonly route: string;
  readonly queryParams: Readonly<Record<string, string>>;
  readonly utm: {
    readonly source: string | null;
    readonly medium: string | null;
    readonly campaign: string | null;
    readonly term: string | null;
    readonly content: string | null;
  };
}

export interface LeadSubmission {
  readonly id: string;
  readonly submittedAt: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly role: string;
  readonly processDescription: string;
  readonly preferredContactMethod: PreferredContactMethod;
  readonly source: LeadSourceMetadata;
}

export interface LeadSubmissionInput {
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly role: string;
  readonly processDescription: string;
  readonly preferredContactMethod: PreferredContactMethod;
  readonly route: string;
  readonly queryParams?: Readonly<Record<string, string>>;
}

export interface LeadSubmissionEnvelope {
  readonly schemaVersion: string;
  readonly data: LeadSubmission;
}

export interface LeadSubmissionListEnvelope {
  readonly schemaVersion: string;
  readonly data: readonly LeadSubmission[];
}
