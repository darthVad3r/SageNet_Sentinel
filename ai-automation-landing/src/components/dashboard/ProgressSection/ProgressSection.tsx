import { ProgressItem } from './ProgressItem';
import { projectProgressMock } from './progress.mock';

import styles from './ProgressSection.module.scss';

export function ProgressSection() {
  return (
    <section className={styles['section']} aria-labelledby="project-progress-heading">
      <header className={styles['header']}>
        <h2 id="project-progress-heading" className={styles['title']}>
          Project Progress
        </h2>
      </header>
      <ul className={styles['grid']} aria-label="Project progress timeline">
        {projectProgressMock.map((item) => (
          <ProgressItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
