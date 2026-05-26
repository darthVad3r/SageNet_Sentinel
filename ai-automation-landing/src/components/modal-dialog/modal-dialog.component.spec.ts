import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ModalDialogComponent } from './modal-dialog.component';

@Component({
  standalone: true,
  imports: [ModalDialogComponent],
  template: `
    <button id="trigger" type="button">Trigger</button>
    <app-modal-dialog
      [open]="open"
      title="Delete Workflow"
      description="This action cannot be undone"
      [closeOnBackdrop]="closeOnBackdrop"
      (closed)="onClose($event)"
    >
      <button type="button">Confirm</button>
      <button type="button">Cancel</button>
    </app-modal-dialog>
  `,
})
class HostComponent {
  open = false;

  closeOnBackdrop = true;

  reason = '';

  onClose(reason: string): void {
    this.reason = reason;
  }
}

@Component({
  standalone: true,
  imports: [ModalDialogComponent],
  template: `
    <app-modal-dialog
      [open]="true"
      title="First"
      description="First description"
    ></app-modal-dialog>
    <app-modal-dialog
      [open]="true"
      title="Second"
      description="Second description"
    ></app-modal-dialog>
  `,
})
class DualHostComponent {}

describe('ModalDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, DualHostComponent],
    }).compileComponents();
  });

  it('renders dialog only when open', () => {
    const closedFixture = TestBed.createComponent(HostComponent);
    closedFixture.detectChanges();

    expect(closedFixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();

    const openFixture = TestBed.createComponent(HostComponent);
    openFixture.componentInstance.open = true;
    openFixture.detectChanges();

    const dialog = openFixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('emits close reason from close button', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    const close = fixture.nativeElement.querySelector(
      'button.ui-dialog__close'
    ) as HTMLButtonElement;
    close.click();

    expect(fixture.componentInstance.reason).toBe('close-button');
  });

  it('emits close reason from backdrop click when enabled', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.ui-dialog__backdrop') as HTMLDivElement;
    backdrop.click();

    expect(fixture.componentInstance.reason).toBe('backdrop');
  });

  it('does not close from backdrop click when disabled', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.componentInstance.closeOnBackdrop = false;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.ui-dialog__backdrop') as HTMLDivElement;
    backdrop.click();

    expect(fixture.componentInstance.reason).toBe('');
  });

  it('emits close reason on Escape key', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(fixture.componentInstance.reason).toBe('escape');
  });

  it('traps Tab focus from last to first focusable element', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    const focusable = Array.from(
      fixture.nativeElement.querySelectorAll('.ui-dialog button')
    ) as HTMLButtonElement[];
    const first = focusable[0];
    const last = focusable.at(-1);

    expect(last).toBeDefined();

    last?.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(document.activeElement).toBe(first);
  });

  it('moves focus back into dialog when Tab originates outside the panel', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.directive(ModalDialogComponent))
      .componentInstance as ModalDialogComponent;

    const focusable = Array.from(
      fixture.nativeElement.querySelectorAll('.ui-dialog button')
    ) as HTMLButtonElement[];
    const first = focusable[0];

    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    modal.onTab(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(document.activeElement).toBe(first);

    outsideButton.remove();
  });

  it('traps Shift+Tab focus from first to last focusable element', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.directive(ModalDialogComponent))
      .componentInstance as ModalDialogComponent;

    const focusable = Array.from(
      fixture.nativeElement.querySelectorAll('.ui-dialog button')
    ) as HTMLButtonElement[];
    const first = focusable[0];
    const last = focusable.at(-1);

    expect(last).toBeDefined();

    first.focus();
    modal.onTab(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));

    expect(document.activeElement).toBe(last);
  });

  it('restores focus to trigger when dialog closes', () => {
    const fixture = TestBed.createComponent(ModalDialogComponent);
    fixture.componentRef.setInput('title', 'Test Dialog');

    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);

    trigger.remove();
  });

  it('falls back safely when previously focused element is removed', () => {
    const fixture = TestBed.createComponent(ModalDialogComponent);
    fixture.componentRef.setInput('title', 'Test Dialog');

    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    trigger.remove();

    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    expect(document.activeElement).toBe(document.body);
  });

  it('binds aria references to generated title and description ids', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('h2.ui-dialog__title') as HTMLHeadingElement;
    const description = fixture.nativeElement.querySelector(
      'p.ui-dialog__description'
    ) as HTMLParagraphElement;

    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
    expect(title.id).not.toBe('ui-dialog-title');
    expect(description.id).not.toBe('ui-dialog-description');
  });

  it('generates unique ids for multiple dialog instances', () => {
    const fixture = TestBed.createComponent(DualHostComponent);
    fixture.detectChanges();

    const titles = Array.from(
      fixture.nativeElement.querySelectorAll('h2.ui-dialog__title')
    ) as HTMLHeadingElement[];
    const descriptions = Array.from(
      fixture.nativeElement.querySelectorAll('p.ui-dialog__description')
    ) as HTMLParagraphElement[];
    const dialogs = Array.from(
      fixture.nativeElement.querySelectorAll('[role="dialog"]')
    ) as HTMLElement[];

    expect(titles.length).toBe(2);
    expect(descriptions.length).toBe(2);
    expect(new Set(titles.map((item) => item.id)).size).toBe(2);
    expect(new Set(descriptions.map((item) => item.id)).size).toBe(2);
    expect(dialogs[0]?.getAttribute('aria-labelledby')).toBe(titles[0]?.id);
    expect(dialogs[1]?.getAttribute('aria-labelledby')).toBe(titles[1]?.id);
  });

  it('only closes the topmost open dialog on Escape', () => {
    const firstFixture = TestBed.createComponent(ModalDialogComponent);
    firstFixture.componentRef.setInput('title', 'First Dialog');
    firstFixture.componentRef.setInput('open', true);
    firstFixture.detectChanges();

    const secondFixture = TestBed.createComponent(ModalDialogComponent);
    secondFixture.componentRef.setInput('title', 'Second Dialog');
    secondFixture.componentRef.setInput('open', true);
    secondFixture.detectChanges();

    let firstReason: string | null = null;
    let secondReason: string | null = null;

    firstFixture.componentInstance.closed.subscribe((reason) => {
      firstReason = reason;
    });
    secondFixture.componentInstance.closed.subscribe((reason) => {
      secondReason = reason;
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(firstReason).toBeNull();
    expect(secondReason).toBe('escape');

    firstFixture.destroy();
    secondFixture.destroy();
  });
});
