import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { QuickActionShortcutsComponent } from './quick-action-shortcuts.component';
import { QUICK_ACTION_SHORTCUTS_MOCK } from './quick-action-shortcuts.mock';

describe('QuickActionShortcutsComponent', () => {
  let routerMock: { navigateByUrl: (url: string) => Promise<boolean> };
  let lastNavigatedUrl: string | null;

  beforeEach(async () => {
    lastNavigatedUrl = null;
    routerMock = {
      navigateByUrl: async (url: string) => {
        lastNavigatedUrl = url;
        return true;
      },
    };

    await TestBed.configureTestingModule({
      imports: [QuickActionShortcutsComponent],
      providers: [
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();
  });

  it('renders all shortcut buttons from mock data', () => {
    const fixture = TestBed.createComponent(QuickActionShortcutsComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const buttons = host.querySelectorAll('button.quick-actions__shortcut');

    expect(buttons.length).toBe(QUICK_ACTION_SHORTCUTS_MOCK.length);
  });

  it('associates section heading for accessibility', () => {
    const fixture = TestBed.createComponent(QuickActionShortcutsComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const section = host.querySelector('section.quick-actions');
    const heading = host.querySelector('#quick-actions-title');

    expect(heading?.textContent?.trim()).toBe('Quick Actions');
    expect(section?.getAttribute('aria-labelledby')).toBe('quick-actions-title');
  });

  it('uses aria-labelledby for each shortcut button', () => {
    const fixture = TestBed.createComponent(QuickActionShortcutsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(host.querySelectorAll('button.quick-actions__shortcut'));

    for (const [index, button] of buttons.entries()) {
      const shortcut = QUICK_ACTION_SHORTCUTS_MOCK[index];
      const titleId = component.shortcutTitleId(shortcut);
      const descriptionId = shortcut.description ? component.shortcutDescriptionId(shortcut) : null;

      const labelledBy = button.getAttribute('aria-labelledby');
      expect(labelledBy).toBe(component.shortcutLabelledBy(shortcut));

      const titleEl = host.querySelector(`#${titleId}`);
      expect(titleEl?.textContent?.trim()).toBe(shortcut.title);

      if (descriptionId) {
        const descriptionEl = host.querySelector(`#${descriptionId}`);
        expect(descriptionEl?.textContent?.trim()).toBe(shortcut.description);
      }
    }
  });

  it('navigates to shortcut route on click', () => {
    const fixture = TestBed.createComponent(QuickActionShortcutsComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const firstButton = host.querySelector('button.quick-actions__shortcut') as HTMLButtonElement;

    firstButton.click();

    expect(lastNavigatedUrl).toBe(QUICK_ACTION_SHORTCUTS_MOCK[0].route ?? '/dashboard');
  });
});
