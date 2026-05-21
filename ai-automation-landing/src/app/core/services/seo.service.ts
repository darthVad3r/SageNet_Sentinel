import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoStructuredDataEntry {
  id: string;
  schema: object;
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  structuredData?: SeoStructuredDataEntry[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);

  private readonly title = inject(Title);

  private readonly meta = inject(Meta);

  applyMetadata(metadata: SeoMetadata): void {
    this.setPageMeta(metadata.title, metadata.description);

    if (metadata.canonicalUrl) {
      this.setCanonicalUrl(metadata.canonicalUrl);
    }

    this.clearStructuredData();

    metadata.structuredData?.forEach((entry) => {
      this.setStructuredData(entry.id, entry.schema);
    });
  }

  setPageMeta(pageTitle: string, description: string): void {
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  setCanonicalUrl(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  setStructuredData(id: string, schema: object): void {
    const scriptId = `structured-data-${id}`;
    const existing = this.document.getElementById(scriptId);

    if (existing) {
      existing.remove();
    }

    const script = this.document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  private clearStructuredData(): void {
    const scripts = this.document.querySelectorAll('script[id^="structured-data-"]');
    scripts.forEach((script) => script.remove());
  }
}
