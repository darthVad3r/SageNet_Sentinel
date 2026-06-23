import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  template: `
    <article class="testimonial">
      <p class="testimonial__quote">“{{ quote }}”</p>
      <p class="testimonial__author">{{ name }}</p>
      <p class="testimonial__role">{{ role }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .testimonial {
        background: var(--lab-surface);
        border: 1px solid var(--lab-line);
        border-radius: 1rem;
        padding: 1.25rem;
      }

      .testimonial__quote {
        margin: 0 0 0.85rem;
        color: var(--lab-ink);
      }

      .testimonial__author {
        margin: 0;
        font-weight: 700;
      }

      .testimonial__role {
        margin: 0.15rem 0 0;
        color: var(--lab-ink-soft);
        font-size: 0.9rem;
      }
    `,
  ],
})
export class TestimonialCardComponent {
  @Input({ required: true }) quote = '';

  @Input({ required: true }) name = '';

  @Input({ required: true }) role = '';
}
