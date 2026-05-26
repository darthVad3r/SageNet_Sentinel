import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export interface SelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

@Component({
  selector: 'app-select-dropdown',
  standalone: true,
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDropdownComponent {
  readonly id = input.required<string>();

  readonly label = input.required<string>();

  readonly value = model<string>('');

  readonly options = input<readonly SelectOption[]>([]);

  readonly placeholder = input<string>('Select an option');

  readonly hint = input<string>('');

  readonly error = input<string>('');

  readonly required = input<boolean>(false);

  readonly disabled = input<boolean>(false);

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

  onSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value.set(target.value);
  }
}
