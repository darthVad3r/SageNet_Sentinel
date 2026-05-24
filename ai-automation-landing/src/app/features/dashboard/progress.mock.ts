import type { ProgressRecord } from './progress.types';

export const projectProgressMock: readonly ProgressRecord[] = [
  {
    id: 'dashboard-skeleton',
    title: 'Dashboard Skeleton',
    status: 'done',
    percent: 100,
  },
  {
    id: 'design-system',
    title: 'Design System',
    status: 'in-progress',
    percent: 82,
  },
  {
    id: 'authentication-gate',
    title: 'Authentication Gate',
    status: 'in-review',
    percent: 68,
  },
  {
    id: 'workflow-builder',
    title: 'Workflow Builder',
    status: 'in-progress',
    percent: 35,
  },
  {
    id: 'automation-editor',
    title: 'Automation Editor',
    status: 'not-started',
    percent: 0,
  },
  {
    id: 'analytics-pipeline',
    title: 'Analytics Pipeline',
    status: 'in-review',
    percent: 47,
  },
] as const;
