import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  GapToken,
  LayoutMode,
  SpacingLayoutPrimitivesComponent,
} from './spacing-layout-primitives.component';

@Component({
  standalone: true,
  imports: [SpacingLayoutPrimitivesComponent],
  template: `
    <app-spacing-layout-primitives
      [mode]="mode"
      [gap]="gap"
      [padding]="padding"
      [columns]="columns"
      [wrap]="wrap"
    >
      <span>One</span>
      <span>Two</span>
      <span>Three</span>
    </app-spacing-layout-primitives>
  `,
})
class HostComponent {
  mode: LayoutMode = 'stack';

  gap: GapToken = '6';

  padding: GapToken = '4';

  columns = 3;

  wrap = false;
}

describe('SpacingLayoutPrimitivesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('renders projected content with stack mode by default', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const layout = fixture.nativeElement.querySelector('.ui-layout') as HTMLElement;

    expect(layout.classList.contains('ui-layout--stack')).toBe(true);
    expect(layout.children.length).toBe(3);
  });

  it('applies grid mode and tokenized columns style', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mode = 'grid';
    fixture.componentInstance.columns = 4;
    fixture.detectChanges();

    const layout = fixture.nativeElement.querySelector('.ui-layout') as HTMLElement;

    expect(layout.classList.contains('ui-layout--grid')).toBe(true);
    expect(layout.style.getPropertyValue('--ui-layout-columns')).toBe('4');
  });

  it('applies tokenized gap css variable', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.gap = '10';
    fixture.detectChanges();

    const layout = fixture.nativeElement.querySelector('.ui-layout') as HTMLElement;

    expect(layout.style.getPropertyValue('--ui-layout-gap')).toBe('var(--lab-space-10)');
  });

  it('applies wrap modifier for inline layouts', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mode = 'inline';
    fixture.componentInstance.wrap = true;
    fixture.detectChanges();

    const layout = fixture.nativeElement.querySelector('.ui-layout') as HTMLElement;

    expect(layout.classList.contains('ui-layout--inline')).toBe(true);
    expect(layout.classList.contains('ui-layout--wrap')).toBe(true);
  });

  it('renders container mode with max width and padding', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mode = 'container';
    fixture.componentInstance.padding = '6';
    fixture.componentInstance.gap = '4';
    fixture.detectChanges();

    const layout = fixture.nativeElement.querySelector('.ui-layout') as HTMLElement;

    expect(layout.classList.contains('ui-layout--container')).toBe(true);
    expect(layout.style.getPropertyValue('--ui-layout-max-width')).toBe('72rem');
    expect(layout.style.getPropertyValue('--ui-layout-padding')).toBe('var(--lab-space-6)');
  });

  it('renders divider mode as a horizontal rule', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mode = 'divider';
    fixture.detectChanges();

    const divider = fixture.nativeElement.querySelector('hr.ui-divider') as HTMLHRElement;

    expect(divider).not.toBeNull();
    expect(divider.getAttribute('aria-hidden')).toBeNull();
  });
});
