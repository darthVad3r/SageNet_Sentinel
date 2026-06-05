import type { Meta, StoryObj } from '@storybook/angular';

import { InputFieldComponent } from './input-field.component';

interface InputFieldStoryArgs {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'search';
  hint: string;
  error: string;
  required: boolean;
  disabled: boolean;
  blurred: () => void;
}

const meta: Meta<InputFieldStoryArgs> = {
  title: 'UI/Input Field',
  tags: ['autodocs'],
  component: InputFieldComponent,
  render: (args) => ({
    props: args,
    template: `
      <div style="width:320px;">
        <app-input-field
          [id]="id"
          [label]="label"
          [value]="value"
          [placeholder]="placeholder"
          [type]="type"
          [hint]="hint"
          [error]="error"
          [required]="required"
          [disabled]="disabled"
          (blurred)="blurred()"
        ></app-input-field>
      </div>
    `,
  }),
  args: {
    id: 'email-field',
    label: 'Email address',
    value: '',
    placeholder: 'name@company.com',
    type: 'email',
    hint: 'We will never share your email.',
    error: '',
    required: false,
    disabled: false,
    blurred: () => undefined,
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['text', 'email', 'password', 'search'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    blurred: { action: 'blurred' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible input primitive with label, hint/error messaging, and state inputs for form flows.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<InputFieldStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<app-input-field id="email" label="Email" type="email" placeholder="name@company.com"></app-input-field>`,
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:var(--lab-space-4);width:320px;">
        <app-input-field id="state-default" label="Default" placeholder="Default"></app-input-field>
        <app-input-field id="state-error" label="Error" [error]="'A valid email is required'" placeholder="Error"></app-input-field>
        <app-input-field id="state-disabled" label="Disabled" [disabled]="true" placeholder="Disabled"></app-input-field>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};

export const FieldTypes: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:var(--lab-space-3);width:320px;">
        <app-input-field id="type-text" label="Text" type="text"></app-input-field>
        <app-input-field id="type-email" label="Email" type="email"></app-input-field>
        <app-input-field id="type-password" label="Password" type="password"></app-input-field>
        <app-input-field id="type-search" label="Search" type="search"></app-input-field>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};
