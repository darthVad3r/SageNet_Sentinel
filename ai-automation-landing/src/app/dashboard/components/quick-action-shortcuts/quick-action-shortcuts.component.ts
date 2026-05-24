import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { QUICK_ACTION_SHORTCUTS_MOCK } from './quick-action-shortcuts.mock';
import type { QuickAction } from './quick-action-shortcuts.types';

const SECTION_TITLE = 'Quick Actions';
const DEFAULT_ROUTE = '/dashboard';

@Component({
  selector: 'app-quick-action-shortcuts',
  standalone: true,
  templateUrl: './quick-action-shortcuts.component.html',
  styleUrl: './quick-action-shortcuts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionShortcutsComponent {
  private readonly router = inject(Router);

  readonly sectionTitle = SECTION_TITLE;

  readonly shortcuts: readonly QuickAction[] = QUICK_ACTION_SHORTCUTS_MOCK;

  activateShortcut(shortcut: QuickAction): void {
    void this.router.navigateByUrl(shortcut.route ?? DEFAULT_ROUTE);
  }

  shortcutAriaLabel(shortcut: QuickAction): string {
    if (!shortcut.description) {
      return shortcut.title;
    }

    return `${shortcut.title}. ${shortcut.description}`;
  }

  iconAriaLabel(shortcut: QuickAction): string {
    return `${shortcut.title} icon`;
  }
}
