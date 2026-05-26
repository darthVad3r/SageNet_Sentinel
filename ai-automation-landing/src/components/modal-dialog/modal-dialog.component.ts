import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  input,
  output,
} from '@angular/core';

export type DialogCloseReason = 'close-button' | 'backdrop' | 'escape';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialogComponent implements OnChanges, OnDestroy {
  private static instanceCount = 0;

  private static openDialogIds: string[] = [];

  @ViewChild('dialogPanel')
  private readonly dialogPanel?: ElementRef<HTMLElement>;

  readonly open = input<boolean>(false);

  readonly title = input.required<string>();

  readonly description = input<string>('');

  readonly closeOnBackdrop = input<boolean>(true);

  readonly dialogInstanceId = `ui-dialog-${ModalDialogComponent.nextInstanceId()}`;

  readonly titleId = `${this.dialogInstanceId}-title`;

  readonly descriptionId = `${this.dialogInstanceId}-description`;

  readonly closed = output<DialogCloseReason>();

  private lastFocusedElement: HTMLElement | null = null;

  private static nextInstanceId(): number {
    ModalDialogComponent.instanceCount += 1;
    return ModalDialogComponent.instanceCount;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue) {
      this.registerOpenDialog();
      this.capturePreviouslyFocusedElement();
      queueMicrotask(() => this.focusFirstElement());
      return;
    }

    if (changes['open']?.currentValue === false) {
      const wasTopMostDialog = this.isTopMostDialog();
      this.unregisterOpenDialog();

      if (wasTopMostDialog || !this.hasOpenDialogs()) {
        this.restoreFocus();
      }
    }
  }

  ngOnDestroy(): void {
    this.unregisterOpenDialog();
  }

  closeFromButton(): void {
    this.closed.emit('close-button');
  }

  closeFromBackdrop(): void {
    if (!this.closeOnBackdrop()) {
      return;
    }

    this.closed.emit('backdrop');
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!this.open() || !this.isTopMostDialog() || !(event instanceof KeyboardEvent)) {
      return;
    }

    event.preventDefault();
    this.closed.emit('escape');
  }

  @HostListener('document:keydown.tab', ['$event'])
  onTab(event: Event): void {
    if (!this.open() || !this.isTopMostDialog() || !(event instanceof KeyboardEvent)) {
      return;
    }

    const panel = this.dialogPanel?.nativeElement;

    if (!panel) {
      return;
    }

    const focusables = this.getFocusableElements(panel);

    if (!focusables.length) {
      panel.focus();
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables.at(-1);
    const active = document.activeElement as HTMLElement | null;

    if (!active || !panel.contains(active)) {
      (event.shiftKey ? (last ?? first) : first).focus();
      event.preventDefault();
      return;
    }

    if (event.shiftKey && active === first && last) {
      last.focus();
      event.preventDefault();
      return;
    }

    if (!event.shiftKey && active === last) {
      first.focus();
      event.preventDefault();
    }
  }

  private capturePreviouslyFocusedElement(): void {
    this.lastFocusedElement =
      typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null);
  }

  private restoreFocus(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const fallbackTarget = document.body;

    if (this.lastFocusedElement?.isConnected) {
      this.lastFocusedElement.focus();
      return;
    }

    if (fallbackTarget && typeof fallbackTarget.focus === 'function') {
      fallbackTarget.focus();
    }
  }

  private focusFirstElement(): void {
    const panel = this.dialogPanel?.nativeElement;

    if (!panel) {
      return;
    }

    const focusables = this.getFocusableElements(panel);
    (focusables[0] ?? panel).focus();
  }

  private getFocusableElements(root: HTMLElement): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => !el.hasAttribute('aria-hidden')
    );
  }

  private registerOpenDialog(): void {
    if (!ModalDialogComponent.openDialogIds.includes(this.dialogInstanceId)) {
      ModalDialogComponent.openDialogIds.push(this.dialogInstanceId);
    }
  }

  private unregisterOpenDialog(): void {
    ModalDialogComponent.openDialogIds = ModalDialogComponent.openDialogIds.filter(
      (id) => id !== this.dialogInstanceId
    );
  }

  private isTopMostDialog(): boolean {
    return ModalDialogComponent.openDialogIds.at(-1) === this.dialogInstanceId;
  }

  private hasOpenDialogs(): boolean {
    return ModalDialogComponent.openDialogIds.length > 0;
  }
}
