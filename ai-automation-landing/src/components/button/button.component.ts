import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  isDevMode,
  output,
} from '@angular/core';

/** @deprecated Use 'text-only'. 'ghost' remains as a temporary migration alias. */
export type UiButtonVariant = 'primary' | 'secondary' | 'danger' | 'text-only' | 'ghost';
export type UiButtonSize = 'sm' | 'md' | 'lg';
export type UiButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private hasWarnedGhostVariant = false;

  readonly variant = input<UiButtonVariant>('primary');

  readonly size = input<UiButtonSize>('md');

  readonly type = input<UiButtonType>('button');

  readonly disabled = input<boolean>(false);

  readonly loading = input<boolean>(false);

  readonly fullWidth = input<boolean>(false);

  readonly iconLeft = input<string>('');

  readonly iconRight = input<string>('');

  readonly ariaLabel = input<string>('');

  readonly pressed = output<MouseEvent>();

  readonly isGhostVariant = computed(() => this.variant() === 'ghost');

  readonly isInteractiveDisabled = computed(() => this.disabled() || this.loading());

  readonly isTextVariant = computed(() => this.variant() === 'text-only' || this.isGhostVariant());

  constructor() {
    effect(() => {
      if (this.isGhostVariant() && isDevMode() && !this.hasWarnedGhostVariant) {
        console.warn(
          "[app-ui-button] variant 'ghost' is deprecated and will be removed in a future release. Use 'text-only' instead."
        );
        this.hasWarnedGhostVariant = true;
      }
    });
  }

  handleClick(event: MouseEvent): void {
    if (this.isInteractiveDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.pressed.emit(event);
  }
}
