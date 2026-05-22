import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (external) {
      <a
        class="cta"
        [href]="link"
        [attr.aria-label]="label"
        rel="noopener noreferrer"
        target="_blank"
      >
        {{ label }}
      </a>
    } @else {
      <a class="cta" [routerLink]="link" [attr.aria-label]="label">{{ label }}</a>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.1rem;
        border-radius: 0.75rem;
        text-decoration: none;
        font-weight: 600;
        border: 1px solid var(--lab-color-primary);
        background: var(--lab-color-primary);
        color: var(--lab-on-primary);
        transition: all 0.2s ease;
      }

      .cta:hover {
        background: var(--lab-color-primary-strong);
        border-color: var(--lab-color-primary-strong);
      }
    `,
  ],
})
export class CtaButtonComponent {
  @Input({ required: true }) label = '';

  @Input({ required: true }) link = '';

  @Input() external = false;
}
