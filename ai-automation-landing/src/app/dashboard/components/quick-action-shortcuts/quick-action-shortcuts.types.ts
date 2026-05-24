export interface QuickAction {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly route?: string;
  readonly description?: string;
}
