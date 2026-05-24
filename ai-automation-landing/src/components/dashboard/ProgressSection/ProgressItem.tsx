import type { ProgressRecord, ProgressStatus } from './progress.types';

import styles from './ProgressSection.module.scss';

type ProgressItemProps = {
  readonly item: ProgressRecord;
};

const STATUS_LABELS: Record<ProgressStatus, string> = {
  complete: 'Complete',
  'in-progress': 'In Progress',
  planned: 'Planned',
  blocked: 'Blocked',
};

const STATUS_CLASS_NAMES: Record<ProgressStatus, string> = {
  complete: styles['badgeComplete'],
  'in-progress': styles['badgeInProgress'],
  planned: styles['badgePlanned'],
  blocked: styles['badgeBlocked'],
};

const toPercentage = (value?: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
};

export function ProgressItem({ item }: ProgressItemProps) {
  const progressValue = toPercentage(item.percent);

  return (
    <li className={styles['item']}>
      <div className={styles['itemTop']}>
        <h3 className={styles['itemTitle']}>{item.title}</h3>
        <span className={`${styles['badge']} ${STATUS_CLASS_NAMES[item.status]}`}>
          {STATUS_LABELS[item.status]}
        </span>
      </div>
      <p className={styles['percent']}>{progressValue}% complete</p>
      <progress
        className={styles['track']}
        aria-label={`${item.title} progress`}
        value={progressValue}
        max={100}
      />
    </li>
  );
}
