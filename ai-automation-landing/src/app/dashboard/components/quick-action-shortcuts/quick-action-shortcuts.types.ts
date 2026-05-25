export type QuickActionIcon =
  | 'add_task'
  | 'edit_note'
  | 'receipt_long'
  | 'hub'
  | 'settings'
  | 'assistant';

export interface QuickAction {
  readonly id: string;
  readonly title: string;
  readonly icon: QuickActionIcon;
  readonly route?: string;
  readonly description?: string;
}
