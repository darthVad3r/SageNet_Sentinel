import { TestBed } from '@angular/core/testing';

import { ProgressSectionComponent } from './progress-section.component';
import { projectProgressMock } from './progress.mock';

describe('ProgressSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressSectionComponent],
    }).compileComponents();
  });

  it('should render section title and all progress items', () => {
    const fixture = TestBed.createComponent(ProgressSectionComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const heading = host.querySelector('#progress-title');
    const items = host.querySelectorAll('.progress__item');

    expect(heading?.textContent?.trim()).toBe('Project Progress');
    expect(items.length).toBe(projectProgressMock.length);
  });

  it('should map statuses to user-facing labels', () => {
    const fixture = TestBed.createComponent(ProgressSectionComponent);
    const component = fixture.componentInstance;

    expect(component.statusLabel('done')).toBe('Done');
    expect(component.statusLabel('in-progress')).toBe('In Progress');
    expect(component.statusLabel('in-review')).toBe('In Review');
    expect(component.statusLabel('not-started')).toBe('Not Started');
  });

  it('should normalize progress values into the 0..100 range', () => {
    const fixture = TestBed.createComponent(ProgressSectionComponent);
    const component = fixture.componentInstance;

    expect(component.percentage()).toBe(0);
    expect(component.percentage(-10)).toBe(0);
    expect(component.percentage(42.7)).toBe(43);
    expect(component.percentage(120)).toBe(100);
  });

  it('should render accessible progress indicators', () => {
    const fixture = TestBed.createComponent(ProgressSectionComponent);
    fixture.detectChanges();

    const progressBars = Array.from(
      fixture.nativeElement.querySelectorAll('progress.progress__bar')
    ) as HTMLProgressElement[];

    expect(progressBars.length).toBe(projectProgressMock.length);

    for (const [index, bar] of progressBars.entries()) {
      const item = projectProgressMock[index];
      expect(bar.getAttribute('aria-label')).toBe(`${item.title} progress`);
      expect(bar.max).toBe(100);
      expect(bar.value).toBe(Math.max(0, Math.min(100, Math.round(item.percent ?? 0))));
    }
  });
});
