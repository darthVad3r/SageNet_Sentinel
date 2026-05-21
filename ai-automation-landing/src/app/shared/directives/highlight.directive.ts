import { Directive, Input } from '@angular/core';

/**
 * Highlight Directive placeholder
 * Adds highlight effect on hover or interaction
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '[style.backgroundColor]': 'backgroundColor',
  },
})
export class HighlightDirective {
  @Input() highlightColor = 'yellow';

  backgroundColor = '';

  onMouseEnter() {
    this.backgroundColor = this.highlightColor;
  }

  onMouseLeave() {
    this.backgroundColor = '';
  }
}
