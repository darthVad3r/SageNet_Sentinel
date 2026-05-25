import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let navigateByUrlCalls: string[];

  beforeEach(async () => {
    navigateByUrlCalls = [];

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigateByUrl: async (url: string) => {
              navigateByUrlCalls.push(url);
              return true;
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the dashboard sections in the expected order', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const sectionHeadings = Array.from(host.querySelectorAll('.dashboard h1, .dashboard h2')).map(
      (element) => element.textContent?.trim()
    );

    expect(sectionHeadings).toEqual(['Dashboard', 'KPIs', 'Quick Actions', 'Project Progress']);
  });

  it('should render all composed dashboard modules', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.kpi-section')).not.toBeNull();
    expect(host.querySelector('app-quick-action-shortcuts')).not.toBeNull();
    expect(host.querySelector('app-progress-section')).not.toBeNull();
  });

  it('should keep quick actions wired to navigation targets', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const shortcutButtons = host.querySelectorAll<HTMLButtonElement>(
      'button.quick-actions__shortcut'
    );

    expect(shortcutButtons.length).toBeGreaterThan(0);

    shortcutButtons[0]!.click();
    await fixture.whenStable();

    expect(navigateByUrlCalls.length).toBeGreaterThan(0);
  });
});
