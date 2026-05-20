import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

/**
 * Safe Pipe placeholder
 * Sanitizes HTML/URL content for safe template binding
 */
@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: string,
    type: 'html' | 'url' | 'style' | 'script' | 'resource' = 'html'
  ): SafeHtml | SafeUrl | SafeResourceUrl {
    if (!value) {
      return value;
    }

    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resource':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        return this.sanitizer.sanitize(1, value) || value;
    }
  }
}
