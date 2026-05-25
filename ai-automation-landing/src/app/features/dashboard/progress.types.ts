export type ProgressStatus = 'not-started' | 'in-progress' | 'in-review' | 'done';

export interface ProgressRecord {
  readonly id: string;
  readonly title: string;
  readonly status: ProgressStatus;
  readonly percent?: number;
}
