import type { QuickAction } from './quick-action-shortcuts.types';

export const QUICK_ACTION_SHORTCUTS_MOCK: readonly QuickAction[] = [
  {
    id: 'create-workflow',
    title: 'Create Workflow',
    icon: 'add_task',
    route: '/workflows',
    description: 'Start a new workflow template and assign automation steps.',
  },
  {
    id: 'open-automation-editor',
    title: 'Open Automation Editor',
    icon: 'edit_note',
    route: '/workflows',
    description: 'Jump into the automation editor to refine active scenarios.',
  },
  {
    id: 'view-logs',
    title: 'View Logs',
    icon: 'receipt_long',
    route: '/dashboard',
    description: 'Review the latest execution events and delivery outcomes.',
  },
  {
    id: 'manage-integrations',
    title: 'Manage Integrations',
    icon: 'hub',
    route: '/settings',
    description: 'Configure third-party connections used by your automations.',
  },
  {
    id: 'open-settings',
    title: 'Open Settings',
    icon: 'settings',
    route: '/settings',
    description: 'Update account preferences, notifications, and environment options.',
  },
] as const;
