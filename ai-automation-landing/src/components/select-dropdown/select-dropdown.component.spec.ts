import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SelectDropdownComponent, SelectOption } from './select-dropdown.component';

@Component({
  standalone: true,
  imports: [SelectDropdownComponent],
  template: `
    <app-select-dropdown
      id="team"
      label="Team"
      [value]="value"
      [options]="options"
      [required]="true"
      hint="Choose one team"
      [error]="error"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class HostComponent {
  value = '';

  error = '';

  latestValue = '';

  options: readonly SelectOption[] = [
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Operations', value: 'operations', disabled: true },
  ];

  onValueChange(value: string): void {
    this.latestValue = value;
  }
}

describe('SelectDropdownComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('renders options including placeholder', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select.ui-select__control'
    ) as HTMLSelectElement;

    expect(select.options.length).toBe(4);
    expect(select.options[0]?.textContent?.trim()).toBe('Select an option');
    expect(select.options[3]?.disabled).toBe(true);
  });

  it('emits valueChange on selection change', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select.ui-select__control'
    ) as HTMLSelectElement;
    select.value = 'engineering';
    select.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.latestValue).toBe('engineering');
  });

  it('retains selected value when parent has not synced yet', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select.ui-select__control'
    ) as HTMLSelectElement;

    select.value = 'engineering';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('');
    expect(fixture.componentInstance.latestValue).toBe('engineering');
    expect(select.value).toBe('engineering');
  });

  it('associates label and select by id/for', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label.ui-select__label') as HTMLLabelElement;
    const select = fixture.nativeElement.querySelector(
      'select.ui-select__control'
    ) as HTMLSelectElement;

    expect(label.getAttribute('for')).toBe('team');
    expect(select.id).toBe('team');
  });

  it('sets validation accessibility attributes when error exists', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.error = 'Team is required';
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select.ui-select__control'
    ) as HTMLSelectElement;

    expect(select.getAttribute('aria-invalid')).toBe('true');
    expect(select.getAttribute('aria-describedby')).toContain('team-error');
  });
});
