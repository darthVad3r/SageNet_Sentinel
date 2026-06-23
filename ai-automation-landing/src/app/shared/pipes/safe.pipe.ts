import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Safe Pipe placeholder
 * Sanitizes potentially unsafe content for template binding.
 * This pipe does not bypass Angular security.
 */
@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: string | null | undefined,
    type: 'html' | 'url' | 'style' | 'script' | 'resource' = 'html'
  ): string | null {
    if (value == null) {
      return null;
    }

    switch (type) {
      case 'html':
        return this.sanitizer.sanitize(SecurityContext.HTML, value);
      case 'url':
        return this.sanitizer.sanitize(SecurityContext.URL, value);
      case 'style':
        return this.sanitizer.sanitize(SecurityContext.STYLE, value);
      case 'script':
        return this.sanitizer.sanitize(SecurityContext.SCRIPT, value);
      case 'resource':
        return this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, value);
      default:
        return null;
    }
  }
}
