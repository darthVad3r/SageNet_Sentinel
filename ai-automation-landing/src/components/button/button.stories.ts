import type { Meta, StoryObj } from '@storybook/angular';

import {
  ButtonComponent,
  type UiButtonSize,
  type UiButtonType,
  type UiButtonVariant,
} from './button.component';

interface ButtonStoryArgs {
  variant: UiButtonVariant;
  size: UiButtonSize;
  type: UiButtonType;
  disabled: boolean;
  ariaLabel: string;
  label: string;
  pressed: (event: MouseEvent) => void;
}

const meta: Meta<ButtonStoryArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  component: ButtonComponent,
  render: (args) => ({
    props: args,
    template: `
      <app-ui-button
        [variant]="variant"
        [size]="size"
        [type]="type"
        [disabled]="disabled"
        [ariaLabel]="ariaLabel"
        (pressed)="onPressed($event)"
      >
        {{ label }}
      </app-ui-button>
    `,
  }),
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    ariaLabel: 'Save changes',
    label: 'Save',
    pressed: () => undefined,
  },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    label: { control: 'text' },
    pressed: { action: 'pressed' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reusable button primitive supporting variant, size, type, disabled state, and accessible labeling.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<app-ui-button variant="primary" size="md" ariaLabel="Save changes">Save</app-ui-button>`,
      },
    },
  },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:var(--lab-space-3);align-items:center;">
        <app-ui-button variant="primary" ariaLabel="Primary">Primary</app-ui-button>
        <app-ui-button variant="secondary" ariaLabel="Secondary">Secondary</app-ui-button>
        <app-ui-button variant="ghost" ariaLabel="Ghost">Ghost</app-ui-button>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:var(--lab-space-3);align-items:center;">
        <app-ui-button variant="primary" ariaLabel="Enabled">Enabled</app-ui-button>
        <app-ui-button variant="primary" [disabled]="true" ariaLabel="Disabled">Disabled</app-ui-button>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};
