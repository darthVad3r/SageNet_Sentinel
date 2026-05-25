import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { QUICK_ACTION_SHORTCUTS_MOCK } from './quick-action-shortcuts.mock';
import type { QuickAction, QuickActionIcon } from './quick-action-shortcuts.types';

const SECTION_TITLE = 'Quick Actions';
const DEFAULT_ROUTE = '/dashboard';
const ICON_GLYPHS: Readonly<Record<QuickActionIcon, string>> = {
  add_task: '✚',
  edit_note: '✎',
  receipt_long: '≣',
  hub: '◎',
  assistant: '✦',
  settings: '⚙',
};

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

  shortcutTitleId(shortcut: QuickAction): string {
    return `quick-action-title-${shortcut.id}`;
  }

  shortcutDescriptionId(shortcut: QuickAction): string {
    return `quick-action-description-${shortcut.id}`;
  }

  shortcutLabelledBy(shortcut: QuickAction): string {
    if (shortcut.description) {
      return `${this.shortcutTitleId(shortcut)} ${this.shortcutDescriptionId(shortcut)}`;
    }

    return this.shortcutTitleId(shortcut);
  }

  iconGlyph(shortcut: QuickAction): string {
    return ICON_GLYPHS[shortcut.icon];
  }
}
