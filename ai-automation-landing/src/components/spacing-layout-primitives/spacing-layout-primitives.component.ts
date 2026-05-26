import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LayoutMode = 'stack' | 'inline' | 'grid' | 'container' | 'divider';
export type GapToken = '1' | '2' | '3' | '4' | '6' | '8' | '10' | '12' | '16';

@Component({
  selector: 'app-spacing-layout-primitives',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './spacing-layout-primitives.component.html',
  styleUrl: './spacing-layout-primitives.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpacingLayoutPrimitivesComponent {
  readonly mode = input<LayoutMode>('stack');

  readonly gap = input<GapToken>('4');

  readonly align = input<'start' | 'center' | 'end' | 'stretch'>('start');

  readonly justify = input<'start' | 'center' | 'end' | 'space-between'>('start');

  readonly wrap = input<boolean>(false);

  readonly columns = input<number>(2);

  readonly maxWidth = input<string>('72rem');

  readonly padding = input<GapToken>('4');

  readonly hostStyles = computed(() => ({
    '--ui-layout-gap': `var(--lab-space-${this.gap()})`,
    '--ui-layout-columns': `${Math.max(1, Math.round(this.columns()))}`,
    '--ui-layout-max-width': this.maxWidth(),
    '--ui-layout-padding': `var(--lab-space-${this.padding()})`,
  }));
}
