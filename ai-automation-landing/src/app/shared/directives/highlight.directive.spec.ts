import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';

@Component({
  standalone: true,
  template: ` <p appHighlight [highlightColor]="highlightColor">Directive host</p> `,
  imports: [HighlightDirective],
})
class TestHostComponent {
  readonly highlightColor = 'rgb(255, 0, 0)';
}

describe('HighlightDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should apply and clear highlight color on hover events', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const hostElement = fixture.nativeElement.querySelector('p') as HTMLElement;

    hostElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    expect(hostElement.style.backgroundColor).toBe('rgb(255, 0, 0)');

    hostElement.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();

    expect(hostElement.style.backgroundColor).toBe('');
  });
});
