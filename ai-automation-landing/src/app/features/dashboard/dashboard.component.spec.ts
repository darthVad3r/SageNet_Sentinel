import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardService } from '@core/services/dashboard.service';
import { DashboardComponent } from './dashboard.component';

// Flush all pending microtasks/Promises before checking rendered output.
const flushAsync = (): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('DashboardComponent', () => {
  let navigateByUrlCalls: string[];
  let mockDashboardService: {
    loadSummary: ReturnType<typeof vi.fn>;
    loadRecentRuns: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    navigateByUrlCalls = [];
    mockDashboardService = {
      loadSummary: vi.fn(async () => ({
        leadCount: 12,
        workflowCount: 4,
        activeWorkflowCount: 3,
        queuedRunCount: 1,
        runningRunCount: 0,
        succeededRunCount: 8,
        failedRunCount: 1,
        workflowsByStage: [
          { stage: 'discovery', count: 2 },
          { stage: 'live', count: 1 },
        ],
      })),
      loadRecentRuns: vi.fn(async (_page = 1, pageSize = 10) => ({
        total: 1,
        page: 1,
        pageSize,
        data: [
          {
            runId: 'run-1',
            workflowId: 'wf-1',
            workflowName: 'Lead Qualification',
            status: 'succeeded',
            triggeredAt: '2026-06-15T10:00:00.000Z',
            completedAt: '2026-06-15T10:00:05.000Z',
          },
        ],
      })),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
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

  it('should render the dashboard sections in the expected order', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await flushAsync();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const sectionHeadings = Array.from(host.querySelectorAll('.dashboard h1, .dashboard h2')).map(
      (element) => element.textContent?.trim()
    );

    expect(sectionHeadings).toEqual([
      'Dashboard',
      'KPIs',
      'Quick Actions',
      'Workflows by Stage',
      'Recent Activity',
      'Project Progress',
    ]);
  });

  it('should render live KPI values from the dashboard summary', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await flushAsync();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const kpiValues = Array.from(host.querySelectorAll('.kpi__value')).map((element) =>
      element.textContent?.trim()
    );

    expect(kpiValues).toEqual(['12', '3', '10', '80%']);
  });

  it('should render workflow stage breakdown when stages are available', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await flushAsync();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const stageItems = host.querySelectorAll('.stages-section__item');
    expect(stageItems.length).toBe(2);

    const stageNames = Array.from(stageItems).map((el) =>
      el.querySelector('.stages-section__stage')?.textContent?.trim()
    );
    expect(stageNames).toEqual(['discovery', 'live']);
  });

  it('should render recent activity feed with status badges', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await flushAsync();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const activityItems = host.querySelectorAll('.activity-item');
    expect(activityItems.length).toBe(1);

    const badge = activityItems[0]?.querySelector('.activity-item__status');
    expect(badge?.textContent?.trim()).toBe('succeeded');
    expect(badge?.classList.contains('activity-item__status--succeeded')).toBe(true);
  });

  it('should keep quick actions wired to navigation targets', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const shortcutButtons = host.querySelectorAll<HTMLButtonElement>(
      'button.quick-actions__shortcut'
    );

    expect(shortcutButtons.length).toBeGreaterThan(0);

    shortcutButtons.item(0)?.click();
    await fixture.whenStable();

    expect(navigateByUrlCalls.length).toBeGreaterThan(0);
  });

  it('should render empty recent activity message when no runs exist', async () => {
    mockDashboardService.loadRecentRuns.mockResolvedValue({
      total: 0,
      page: 1,
      pageSize: 10,
      data: [],
    });

    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await flushAsync();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.activity-section__empty')?.textContent).toContain(
      'No workflow runs yet'
    );
  });

  it('should request updated runs when page size changes', async () => {
    mockDashboardService.loadRecentRuns.mockImplementation(async (page = 1, pageSize = 10) => ({
      total: 120,
      page,
      pageSize,
      data: [
        {
          runId: `run-${page}-${pageSize}`,
          workflowId: 'wf-1',
          workflowName: 'Lead Qualification',
          status: 'queued',
          triggeredAt: '2026-06-15T10:00:00.000Z',
          completedAt: null,
        },
      ],
    }));

    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await flushAsync();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const pageSizeSelect = host.querySelector<HTMLSelectElement>('#activity-page-size');
    expect(pageSizeSelect).not.toBeNull();
    if (!pageSizeSelect) {
      throw new Error('Expected page size selector to be rendered.');
    }

    pageSizeSelect.value = '25';
    pageSizeSelect.dispatchEvent(new Event('change'));

    await flushAsync();
    fixture.detectChanges();

    expect(mockDashboardService.loadRecentRuns).toHaveBeenLastCalledWith(1, 25);
    expect(host.querySelector('.activity-section__page-label')?.textContent).toContain(
      'Page 1 of 5'
    );
  });
});
