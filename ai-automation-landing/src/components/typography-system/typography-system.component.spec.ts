import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TypographySystemComponent, TypographyVariant } from './typography-system.component';

@Component({
  standalone: true,
  imports: [TypographySystemComponent],
  template: `<app-typography-system [variant]="variant" [text]="text" />`,
})
class HostComponent {
  variant: TypographyVariant = 'body';

  text = 'Hello typography';
}

describe('TypographySystemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('renders body text by default', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const body = fixture.nativeElement.querySelector('p.ui-type--body') as HTMLParagraphElement;

    expect(body.textContent?.trim()).toBe('Hello typography');
  });

  it('renders semantic heading tags for heading variants', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = 'h2';
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h2.ui-type--h2') as HTMLHeadingElement;

    expect(heading).not.toBeNull();
    expect(heading.textContent?.trim()).toBe('Hello typography');
  });

  it('renders caption variant with caption class', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = 'caption';
    fixture.detectChanges();

    const caption = fixture.nativeElement.querySelector(
      'p.ui-type--caption'
    ) as HTMLParagraphElement;

    expect(caption.textContent?.trim()).toBe('Hello typography');
  });

  it('renders all remaining variants with expected selectors', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = 'display';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p.ui-type--display')).not.toBeNull();

    const h1Fixture = TestBed.createComponent(HostComponent);
    h1Fixture.componentInstance.variant = 'h1';
    h1Fixture.detectChanges();
    expect(h1Fixture.nativeElement.querySelector('h1.ui-type--h1')).not.toBeNull();

    const h3Fixture = TestBed.createComponent(HostComponent);
    h3Fixture.componentInstance.variant = 'h3';
    h3Fixture.detectChanges();
    expect(h3Fixture.nativeElement.querySelector('h3.ui-type--h3')).not.toBeNull();

    const h4Fixture = TestBed.createComponent(HostComponent);
    h4Fixture.componentInstance.variant = 'h4';
    h4Fixture.detectChanges();
    expect(h4Fixture.nativeElement.querySelector('h4.ui-type--h4')).not.toBeNull();

    const h5Fixture = TestBed.createComponent(HostComponent);
    h5Fixture.componentInstance.variant = 'h5';
    h5Fixture.detectChanges();
    expect(h5Fixture.nativeElement.querySelector('h5.ui-type--h5')).not.toBeNull();

    const h6Fixture = TestBed.createComponent(HostComponent);
    h6Fixture.componentInstance.variant = 'h6';
    h6Fixture.detectChanges();
    expect(h6Fixture.nativeElement.querySelector('h6.ui-type--h6')).not.toBeNull();

    const bodySmFixture = TestBed.createComponent(HostComponent);
    bodySmFixture.componentInstance.variant = 'body-sm';
    bodySmFixture.detectChanges();
    expect(bodySmFixture.nativeElement.querySelector('p.ui-type--body-sm')).not.toBeNull();

    const labelFixture = TestBed.createComponent(HostComponent);
    labelFixture.componentInstance.variant = 'label';
    labelFixture.detectChanges();
    expect(labelFixture.nativeElement.querySelector('p.ui-type--label')).not.toBeNull();

    const overlineFixture = TestBed.createComponent(HostComponent);
    overlineFixture.componentInstance.variant = 'overline';
    overlineFixture.detectChanges();
    expect(overlineFixture.nativeElement.querySelector('p.ui-type--overline')).not.toBeNull();
  });
});
