import type { Meta, StoryObj } from '@storybook/angular';

import { SelectDropdownComponent, type SelectOption } from './select-dropdown.component';

interface SelectStoryArgs {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  hint: string;
  error: string;
  required: boolean;
  disabled: boolean;
}

const meta: Meta<SelectStoryArgs> = {
  title: 'UI/Select Dropdown',
  tags: ['autodocs'],
  component: SelectDropdownComponent,
  render: (args) => ({
    props: args,
    template: `
      <div style="width:320px;">
        <app-select-dropdown
          [id]="id"
          [label]="label"
          [value]="value"
          [options]="options"
          [placeholder]="placeholder"
          [hint]="hint"
          [error]="error"
          [required]="required"
          [disabled]="disabled"
        ></app-select-dropdown>
      </div>
    `,
  }),
  args: {
    id: 'role-select',
    label: 'Role',
    value: '',
    placeholder: 'Choose role',
    hint: 'Pick the role that best describes this user.',
    error: '',
    required: false,
    disabled: false,
    options: [
      { label: 'Engineer', value: 'engineer' },
      { label: 'Designer', value: 'designer' },
      { label: 'Product Manager', value: 'pm' },
    ],
  },
  argTypes: {
    options: { control: 'object' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Single-select dropdown primitive with placeholder, hint/error messaging, and disabled/required state support.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<app-select-dropdown id="role" label="Role" [options]="options"></app-select-dropdown>`,
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    props: {
      options: [
        { label: 'Engineer', value: 'engineer' },
        { label: 'Designer', value: 'designer' },
      ],
    },
    template: `
      <div style="display:grid;gap:var(--lab-space-4);width:320px;">
        <app-select-dropdown id="select-default" label="Default" [options]="options"></app-select-dropdown>
        <app-select-dropdown id="select-error" label="Error" [options]="options" [error]="'Please select a role'"></app-select-dropdown>
        <app-select-dropdown id="select-disabled" label="Disabled" [options]="options" [disabled]="true"></app-select-dropdown>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};
