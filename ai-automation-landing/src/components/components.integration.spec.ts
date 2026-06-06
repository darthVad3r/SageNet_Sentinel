import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button';
import { CardComponent } from './card';
import { InputFieldComponent } from './input-field';
import { ModalDialogComponent } from './modal-dialog';
import { SelectDropdownComponent } from './select-dropdown';
import { SpacingLayoutPrimitivesComponent } from './spacing-layout-primitives';
import { TypographySystemComponent } from './typography-system';

@Component({
  standalone: true,
  imports: [
    ButtonComponent,
    InputFieldComponent,
    SelectDropdownComponent,
    ModalDialogComponent,
    CardComponent,
    TypographySystemComponent,
    SpacingLayoutPrimitivesComponent,
  ],
  template: `
    <app-spacing-layout-primitives mode="stack" gap="4">
      <app-typography-system variant="h2" text="Component Library Sample" />

      <app-card title="Quick Form">
        <app-spacing-layout-primitives mode="stack" gap="3">
          <app-input-field id="sample-name" label="Name" value="Alex" />
          <app-select-dropdown id="sample-role" label="Role" value="engineer" [options]="options" />
          <app-ui-button>Submit</app-ui-button>
        </app-spacing-layout-primitives>
      </app-card>

      <app-modal-dialog [open]="false" title="Sample Dialog"></app-modal-dialog>
    </app-spacing-layout-primitives>
  `,
})
class ComponentLibrarySamplePageComponent {
  options = [
    { label: 'Engineer', value: 'engineer' },
    { label: 'Designer', value: 'designer' },
  ];
}

describe('Component Library Integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentLibrarySamplePageComponent],
    }).compileComponents();
  });

  it('renders all foundational components together without errors', () => {
    const fixture = TestBed.createComponent(ComponentLibrarySamplePageComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('app-typography-system')).not.toBeNull();
    expect(host.querySelector('app-card')).not.toBeNull();
    expect(host.querySelector('app-input-field')).not.toBeNull();
    expect(host.querySelector('app-select-dropdown')).not.toBeNull();
    expect(host.querySelector('app-ui-button')).not.toBeNull();
    expect(host.querySelector('app-modal-dialog')).not.toBeNull();
    expect(host.querySelector('app-spacing-layout-primitives')).not.toBeNull();
  });
});
