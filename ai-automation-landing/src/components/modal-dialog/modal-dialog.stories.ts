import type { Meta, StoryObj } from '@storybook/angular';

import { ModalDialogComponent } from './modal-dialog.component';

interface ModalStoryArgs {
  open: boolean;
  title: string;
  description: string;
  closeOnBackdrop: boolean;
  closed: (reason: string) => void;
}

const meta: Meta<ModalStoryArgs> = {
  title: 'UI/Modal Dialog',
  tags: ['autodocs'],
  component: ModalDialogComponent,
  render: (args) => ({
    props: args,
    template: `
      <app-modal-dialog
        [open]="open"
        [title]="title"
        [description]="description"
        [closeOnBackdrop]="closeOnBackdrop"
        (closed)="closed($event)"
      >
        <p>Dialog body content</p>
        <button type="button">Focusable action</button>
      </app-modal-dialog>
    `,
  }),
  args: {
    open: true,
    title: 'Confirm change',
    description: 'Review and confirm the update before continuing.',
    closeOnBackdrop: true,
    closed: () => undefined,
  },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    closeOnBackdrop: { control: 'boolean' },
    closed: { action: 'closed' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible dialog with ESC handling, optional backdrop close, and focus trapping while open.',
      },
      source: {
        code: `<app-modal-dialog [open]="true" title="Confirm" description="Are you sure?">...</app-modal-dialog>`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<ModalStoryArgs>;

export const Default: Story = {};

export const BackdropDisabled: Story = {
  args: {
    closeOnBackdrop: false,
  },
};

export const ClosedState: Story = {
  args: {
    open: false,
  },
};
