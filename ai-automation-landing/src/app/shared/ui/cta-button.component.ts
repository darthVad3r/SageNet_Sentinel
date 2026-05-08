import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cta-button',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <a
      *ngIf="external; else internalLink"
      class="cta"
      [href]="link"
      [attr.aria-label]="label"
      rel="noopener noreferrer"
      target="_blank"
    >
      {{ label }}
    </a>

    <ng-template #internalLink>
      <a class="cta" [routerLink]="link" [attr.aria-label]="label">{{ label }}</a>
    </ng-template>
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
        border: 1px solid #111827;
        background: #111827;
        color: #ffffff;
        transition: all 0.2s ease;
      }

      .cta:hover {
        background: #1f2937;
        border-color: #1f2937;
      }
    `
  ]
})
export class CtaButtonComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) link = '';
  @Input() external = false;
}
