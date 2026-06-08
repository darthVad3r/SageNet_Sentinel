import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'body-sm'
  | 'label'
  | 'caption';

@Component({
  selector: 'app-typography-system',
  standalone: true,
  templateUrl: './typography-system.component.html',
  styleUrl: './typography-system.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypographySystemComponent {
  readonly text = input.required<string>();

  readonly variant = input<TypographyVariant>('body');
}
