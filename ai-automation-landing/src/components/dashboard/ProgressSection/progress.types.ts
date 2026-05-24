export type ProgressStatus = 'complete' | 'in-progress' | 'planned' | 'blocked';

export interface ProgressRecord {
  readonly id: string;
  readonly title: string;
  readonly status: ProgressStatus;
  readonly percent?: number;
}
