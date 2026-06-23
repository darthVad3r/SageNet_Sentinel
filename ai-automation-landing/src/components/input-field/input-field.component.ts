import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-input-field',
  standalone: true,
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
  readonly id = input.required<string>();

  readonly label = input.required<string>();

  readonly value = model<string>('');

  readonly placeholder = input<string>('');

  readonly type = input<'text' | 'email' | 'password' | 'search'>('text');

  readonly hint = input<string>('');

  readonly error = input<string>('');

  readonly required = input<boolean>(false);

  readonly disabled = input<boolean>(false);

  readonly blurred = output<void>();

  readonly describedBy = computed(() => {
    const ids: string[] = [];

    if (this.hint()) {
      ids.push(`${this.id()}-hint`);
    }

    if (this.error()) {
      ids.push(`${this.id()}-error`);
    }

    return ids.join(' ') || null;
  });

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur(): void {
    this.blurred.emit();
  }
}
