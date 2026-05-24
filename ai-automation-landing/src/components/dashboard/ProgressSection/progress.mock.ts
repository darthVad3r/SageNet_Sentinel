import type { ProgressRecord } from './progress.types';

export const projectProgressMock: readonly ProgressRecord[] = [
  {
    id: 'dashboard-skeleton',
    title: 'Dashboard Skeleton',
    status: 'complete',
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
    status: 'in-progress',
    percent: 68,
  },
  {
    id: 'workflow-builder',
    title: 'Workflow Builder',
    status: 'planned',
    percent: 35,
  },
  {
    id: 'automation-editor',
    title: 'Automation Editor',
    status: 'planned',
    percent: 28,
  },
  {
    id: 'analytics-pipeline',
    title: 'Analytics Pipeline',
    status: 'blocked',
    percent: 47,
  },
] as const;
