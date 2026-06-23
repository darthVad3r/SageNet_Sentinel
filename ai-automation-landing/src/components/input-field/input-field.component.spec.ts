import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { InputFieldComponent } from './input-field.component';

@Component({
  standalone: true,
  imports: [InputFieldComponent],
  template: `
    <app-input-field
      id="email"
      label="Email"
      [value]="value"
      hint="Use your work email"
      [error]="error"
      [required]="true"
      (valueChange)="onValueChange($event)"
      (blurred)="onBlurred()"
    />
  `,
})
class HostComponent {
  value = 'person@example.com';

  error = '';

  latestValue = '';

  blurred = false;

  onValueChange(value: string): void {
    this.latestValue = value;
  }

  onBlurred(): void {
    this.blurred = true;
  }
}

describe('InputFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('renders label and input relationship accessibly', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const label = host.querySelector('label.ui-field__label') as HTMLLabelElement;
    const input = host.querySelector('input.ui-field__control') as HTMLInputElement;

    expect(label.getAttribute('for')).toBe('email');
    expect(input.id).toBe('email');
  });

  it('builds aria-describedby for hint and error text', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.error = 'Email is required';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input.ui-field__control'
    ) as HTMLInputElement;
    const describedBy = input.getAttribute('aria-describedby') ?? '';

    expect(describedBy).toContain('email-hint');
    expect(describedBy).toContain('email-error');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('emits valueChange on user input', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input.ui-field__control'
    ) as HTMLInputElement;
    input.value = 'new@example.com';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.latestValue).toBe('new@example.com');
  });

  it('retains typed value when parent has not synced yet', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input.ui-field__control'
    ) as HTMLInputElement;

    input.value = 'unsynced@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('person@example.com');
    expect(fixture.componentInstance.latestValue).toBe('unsynced@example.com');
    expect(input.value).toBe('unsynced@example.com');
  });

  it('emits blurred event on blur', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input.ui-field__control'
    ) as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));

    expect(fixture.componentInstance.blurred).toBe(true);
  });
});
