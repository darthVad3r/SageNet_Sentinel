import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card title="Platform Health" subtitle="Updated 2 minutes ago" [variant]="variant">
      <div card-header>Header area</div>
      <p>All systems are operating normally.</p>
      <div card-footer>Footer area</div>
    </app-card>
  `,
})
class HostComponent {
  variant: 'elevated' | 'flat' | 'outlined' = 'elevated';
}

describe('CardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('renders title, subtitle, and projected content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.ui-card__title')?.textContent?.trim()).toBe('Platform Health');
    expect(host.querySelector('.ui-card__subtitle')?.textContent?.trim()).toBe(
      'Updated 2 minutes ago'
    );
    expect(host.querySelector('.ui-card__content p')?.textContent?.trim()).toBe(
      'All systems are operating normally.'
    );
  });

  it('applies variant classes when configured', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = 'outlined';
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.ui-card') as HTMLElement;

    expect(card.classList.contains('ui-card--outlined')).toBe(true);
  });

  it('provides aria-label when title is present', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.ui-card') as HTMLElement;

    expect(card.getAttribute('aria-label')).toBe('Platform Health card');
  });

  it('projects header and footer content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[card-header]')?.textContent?.trim()).toBe(
      'Header area'
    );
    expect(fixture.nativeElement.querySelector('[card-footer]')?.textContent?.trim()).toBe(
      'Footer area'
    );
  });
});
