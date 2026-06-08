import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-ui-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
      (pressed)="onPressed($event)"
    >
      Save
    </app-ui-button>
  `,
})
class HostComponent {
  variant: 'primary' | 'secondary' | 'ghost' = 'primary';

  size: 'sm' | 'md' | 'lg' = 'md';

  disabled = false;

  ariaLabel = 'Save changes';

  pressCount = 0;

  onPressed(_event: MouseEvent): void {
    this.pressCount += 1;
  }
}

describe('ButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('renders projected text content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.ui-button') as HTMLButtonElement;

    expect(button.textContent?.trim()).toBe('Save');
    expect(button.getAttribute('aria-label')).toBe('Save changes');
  });

  it('applies variant and size classes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = 'secondary';
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.ui-button') as HTMLButtonElement;

    expect(button.classList.contains('ui-button--secondary')).toBe(true);
    expect(button.classList.contains('ui-button--lg')).toBe(true);
  });

  it('emits pressed event on click', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.ui-button') as HTMLButtonElement;
    button.click();

    expect(fixture.componentInstance.pressCount).toBe(1);
  });

  it('does not emit when disabled', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.ui-button') as HTMLButtonElement;
    button.click();

    expect(fixture.componentInstance.pressCount).toBe(0);
    expect(button.disabled).toBe(true);
  });

  it('prevents default behavior in handler when disabled is true', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.pressed, 'emit');
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent;

    component.handleClick(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
