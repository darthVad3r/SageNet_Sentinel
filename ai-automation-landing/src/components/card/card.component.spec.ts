import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card title="Platform Health" subtitle="Updated 2 minutes ago" [surface]="surface">
      <p>All systems are operating normally.</p>
    </app-card>
  `,
})
class HostComponent {
  surface: 'default' | 'muted' = 'default';
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

  it('applies muted surface class when configured', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.surface = 'muted';
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.ui-card') as HTMLElement;

    expect(card.classList.contains('ui-card--muted')).toBe(true);
  });

  it('provides aria-label when title is present', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.ui-card') as HTMLElement;

    expect(card.getAttribute('aria-label')).toBe('Platform Health card');
  });
});
